/*
	Adds support for sharing IA ("Interactive Application") Form Application records
	through CMSMailbox, and threading for reply-only compose.

	Run against dev/QA after 001/002. See plan doc Section 6 for the full design
	rationale (two-gate access re-verification, why ReplyToMessageID exists).
*/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Threading: a reply references the message it's replying to. Recipient lists for a
-- reply are derived from the thread's existing participants, never a free picker —
-- this is what satisfies "recipients may only message prior senders" without any
-- separate allowlist table.
ALTER TABLE [dbo].[MBX_Message] ADD [ReplyToMessageID] [int] NULL
GO

ALTER TABLE [dbo].[MBX_Message] WITH CHECK ADD CONSTRAINT [FK_MBX_Message_ReplyTo] FOREIGN KEY([ReplyToMessageID])
REFERENCES [dbo].[MBX_Message] ([MessageID])
GO
ALTER TABLE [dbo].[MBX_Message] CHECK CONSTRAINT [FK_MBX_Message_ReplyTo]
GO

CREATE NONCLUSTERED INDEX [IX_MBX_Message_ReplyToMessageID] ON [dbo].[MBX_Message]
(
	[ReplyToMessageID] ASC
)
GO

-- IAFormRecord items need both FormID (template) and ItemID=MainID (the specific
-- record/submission) — every other item type only needs one identifier.
ALTER TABLE [dbo].[MBX_MessageItem] ADD [FormID] [varchar](100) NULL
GO

-- Widen the controlled vocabulary. Deliberately still excludes the OLD 'Application'
-- type (NEO_ApplicationStatus/ApplicationFileViewer — unrelated subsystem, still has
-- a live IDOR, tracked separately). 'IAFormRecord' is the NEW Interactive Application
-- record type, safe because CMSMailbox applies its own two-gate check (see
-- ItemController) rather than trusting the underlying procs to self-protect.
ALTER TABLE [dbo].[MBX_MessageItem] DROP CONSTRAINT [CK_MBX_MessageItem_ItemType]
GO
ALTER TABLE [dbo].[MBX_MessageItem] WITH CHECK ADD CONSTRAINT [CK_MBX_MessageItem_ItemType]
CHECK ([ItemType] IN ('File','FollowupAttachment','IAField','DRField','ExamFile','IAFormRecord'))
GO
ALTER TABLE [dbo].[MBX_MessageItem] CHECK CONSTRAINT [CK_MBX_MessageItem_ItemType]
GO


-- Updated to also return FormID (needed by the client to call the IAFormRecord
-- rendering endpoint) and ReplyToMessageID (so the UI knows this is a threaded reply).
CREATE OR ALTER PROCEDURE [dbo].[MBX_GetMessage]
	@UID INT,
	@MessageID INT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT 1 FROM MBX_Recipient WHERE MessageID = @MessageID AND ToUID = @UID)
	BEGIN
		RETURN
	END

	SELECT
		m.MessageID, m.Subject, m.Body, m.DTCreated, m.ReplyToMessageID,
		u.Fname + ' ' + u.Lname AS FromName,
		c.Company AS FromCompany
	FROM MBX_Message m
	JOIN Users u ON u.UID = m.FromUID
	JOIN Companies c ON c.CID = m.FromCID
	WHERE m.MessageID = @MessageID AND m.IsDeleted = 0

	SELECT MessageItemID, ItemType, ItemID, ItemLabel, FormID
	FROM MBX_MessageItem
	WHERE MessageID = @MessageID
END
GO


-- Updated to also accept FormID for IAFormRecord items (ItemsJSON entries can now
-- include "FormID"; it's simply NULL/ignored for other item types).
CREATE OR ALTER PROCEDURE [dbo].[MBX_AddMessageItems]
	@MessageID INT,
	@ItemsJSON NVARCHAR(MAX)
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	INSERT INTO MBX_MessageItem (MessageID, ItemType, ItemID, ItemLabel, OwnerCID, FormID)
	SELECT
		@MessageID,
		j.ItemType,
		j.ItemID,
		j.ItemLabel,
		j.OwnerCID,
		j.FormID
	FROM OPENJSON(@ItemsJSON)
	WITH (
		ItemType VARCHAR(20) '$.ItemType',
		ItemID NVARCHAR(50) '$.ItemID',
		ItemLabel NVARCHAR(255) '$.ItemLabel',
		OwnerCID INT '$.OwnerCID',
		FormID VARCHAR(100) '$.FormID'
	) j

	SELECT MessageItemID, ItemType, ItemID, ItemLabel, FormID FROM MBX_MessageItem WHERE MessageID = @MessageID
END
GO


-- Returns the distinct set of users who have ever sent @uid a message — i.e. who
-- @uid is allowed to reply to. This is a listing/discovery helper only; it does NOT
-- itself authorize anything. The actual reply-target restriction is enforced by
-- MBX_SendReply below always deriving recipients from the thread, never accepting an
-- arbitrary recipient list.
CREATE OR ALTER PROCEDURE [dbo].[MBX_GetPriorSenders]
	@UID INT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	SELECT DISTINCT m.FromUID, u.Fname + ' ' + u.Lname AS FromName, c.Company AS FromCompany
	FROM MBX_Recipient r
	JOIN MBX_Message m ON m.MessageID = r.MessageID AND m.IsDeleted = 0
	JOIN Users u ON u.UID = m.FromUID
	JOIN Companies c ON c.CID = m.FromCID
	WHERE r.ToUID = @UID
END
GO


-- Sends a reply within an existing thread. Recipients are ALWAYS derived from the
-- original message's participants (its sender plus every other recipient, minus the
-- replying user) — @UID cannot address anyone outside that set. This is the whole
-- enforcement mechanism for "recipients may only message prior senders": there is no
-- code path in CMSMailbox that accepts an arbitrary recipient list at all.
CREATE OR ALTER PROCEDURE [dbo].[MBX_SendReply]
	@UID INT,
	@ReplyToMessageID INT,
	@Subject NVARCHAR(255),
	@Body NVARCHAR(MAX) = NULL
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	-- @UID must actually be a participant of the thread being replied to (either the
	-- original sender or an original recipient) — fail closed otherwise.
	IF NOT EXISTS (
		SELECT 1 FROM MBX_Message WHERE MessageID = @ReplyToMessageID AND (FromUID = @UID OR EXISTS (
			SELECT 1 FROM MBX_Recipient WHERE MessageID = @ReplyToMessageID AND ToUID = @UID
		))
	)
	BEGIN
		RETURN
	END

	DECLARE @FromCID INT = dbo.mycid(@UID)
	DECLARE @NewMessageID INT

	INSERT INTO MBX_Message (FromUID, FromCID, Subject, Body, ReplyToMessageID)
	SELECT @UID, @FromCID, @Subject, @Body, @ReplyToMessageID

	SELECT @NewMessageID = SCOPE_IDENTITY()

	;WITH participants AS (
		SELECT FromUID AS UID FROM MBX_Message WHERE MessageID = @ReplyToMessageID
		UNION
		SELECT ToUID FROM MBX_Recipient WHERE MessageID = @ReplyToMessageID
	)
	INSERT INTO MBX_Recipient (MessageID, ToUID, ToCID)
	SELECT @NewMessageID, u.UID, u.CID
	FROM participants p
	JOIN Users u ON u.UID = p.UID AND u.Active = 1
	WHERE p.UID <> @UID

	SELECT @NewMessageID AS MessageID
END
GO
