/*
	MBX_* stored procedures — CMSMailbox companion app.

	These are the ONLY new procs required. All item-viewing/access-re-verification goes
	through CMSNEO's EXISTING procs (Neo_GetFile, NEO_GetFollowupAttachment,
	NEO_IAGetDownloadFile, NEO_DRGetDownloadFile, NEO_MGTGetDoc) called with the
	recipient's own @uid — see MBX_GetMessage below for the gate that must pass before
	the calling app is allowed to attempt that.

	Assumes dbo.mycid(@uid) already exists (used elsewhere, e.g. NEOMyNetwork) to resolve
	a user's own CID.
*/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER PROCEDURE [dbo].[MBX_SendMessage]
	@FromUID INT,
	@Subject NVARCHAR(255),
	@Body NVARCHAR(MAX) = NULL
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	DECLARE @FromCID INT = dbo.mycid(@FromUID)

	INSERT INTO MBX_Message (FromUID, FromCID, Subject, Body)
	SELECT @FromUID, @FromCID, @Subject, @Body

	SELECT SCOPE_IDENTITY() AS MessageID
END
GO


CREATE OR ALTER PROCEDURE [dbo].[MBX_AddRecipients]
	@MessageID INT,
	@RecipientUIDsCSV VARCHAR(MAX)
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	;WITH ids AS (
		SELECT DISTINCT TRY_CAST(value AS INT) AS UID
		FROM STRING_SPLIT(@RecipientUIDsCSV, ',')
		WHERE TRY_CAST(value AS INT) IS NOT NULL
	)
	INSERT INTO MBX_Recipient (MessageID, ToUID, ToCID)
	SELECT @MessageID, u.UID, u.CID
	FROM ids
	JOIN Users u ON u.UID = ids.UID AND u.Active = 1
	WHERE NOT EXISTS (
		SELECT 1 FROM MBX_Recipient r WHERE r.MessageID = @MessageID AND r.ToUID = u.UID
	)

	SELECT ToUID, ToCID FROM MBX_Recipient WHERE MessageID = @MessageID
END
GO


-- @ItemsJSON: JSON array of { "ItemType": "...", "ItemID": "...", "ItemLabel": "...", "OwnerCID": ... }
CREATE OR ALTER PROCEDURE [dbo].[MBX_AddMessageItems]
	@MessageID INT,
	@ItemsJSON NVARCHAR(MAX)
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	INSERT INTO MBX_MessageItem (MessageID, ItemType, ItemID, ItemLabel, OwnerCID)
	SELECT
		@MessageID,
		j.ItemType,
		j.ItemID,
		j.ItemLabel,
		j.OwnerCID
	FROM OPENJSON(@ItemsJSON)
	WITH (
		ItemType VARCHAR(20) '$.ItemType',
		ItemID NVARCHAR(50) '$.ItemID',
		ItemLabel NVARCHAR(255) '$.ItemLabel',
		OwnerCID INT '$.OwnerCID'
	) j

	SELECT MessageItemID, ItemType, ItemID, ItemLabel FROM MBX_MessageItem WHERE MessageID = @MessageID
END
GO


CREATE OR ALTER PROCEDURE [dbo].[MBX_GetInbox]
	@UID INT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	SELECT
		m.MessageID,
		m.Subject,
		LEFT(ISNULL(m.Body,''), 200) AS Preview,
		m.DTCreated,
		r.DTViewed,
		r.IsArchived,
		u.Fname + ' ' + u.Lname AS FromName,
		c.Company AS FromCompany,
		(SELECT COUNT(*) FROM MBX_MessageItem mi WHERE mi.MessageID = m.MessageID) AS ItemCount
	FROM MBX_Recipient r
	JOIN MBX_Message m ON m.MessageID = r.MessageID AND m.IsDeleted = 0
	JOIN Users u ON u.UID = m.FromUID
	JOIN Companies c ON c.CID = m.FromCID
	WHERE r.ToUID = @UID
	ORDER BY m.DTCreated DESC
END
GO


-- The first access gate: a message + its items are only ever returned if @UID is a
-- genuine recipient of @MessageID. This does NOT grant access to the underlying
-- items themselves — the calling app must still call the matching existing CMSNEO
-- proc per item, using @UID, before streaming any bytes (see plan doc, Section 4).
CREATE OR ALTER PROCEDURE [dbo].[MBX_GetMessage]
	@UID INT,
	@MessageID INT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT 1 FROM MBX_Recipient WHERE MessageID = @MessageID AND ToUID = @UID)
	BEGIN
		-- Deliberately return nothing distinguishable from "message doesn't exist" —
		-- never confirm existence of a message the caller isn't a recipient of.
		RETURN
	END

	SELECT
		m.MessageID, m.Subject, m.Body, m.DTCreated,
		u.Fname + ' ' + u.Lname AS FromName,
		c.Company AS FromCompany
	FROM MBX_Message m
	JOIN Users u ON u.UID = m.FromUID
	JOIN Companies c ON c.CID = m.FromCID
	WHERE m.MessageID = @MessageID AND m.IsDeleted = 0

	SELECT MessageItemID, ItemType, ItemID, ItemLabel
	FROM MBX_MessageItem
	WHERE MessageID = @MessageID
END
GO


CREATE OR ALTER PROCEDURE [dbo].[MBX_MarkRead]
	@UID INT,
	@MessageID INT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	UPDATE MBX_Recipient
	SET DTViewed = getdate()
	WHERE MessageID = @MessageID AND ToUID = @UID AND DTViewed IS NULL
END
GO


CREATE OR ALTER PROCEDURE [dbo].[MBX_MarkArchived]
	@UID INT,
	@MessageID INT,
	@Archived BIT
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	UPDATE MBX_Recipient
	SET IsArchived = @Archived
	WHERE MessageID = @MessageID AND ToUID = @UID
END
GO


-- Called by CMSMailbox for every item-open attempt, success or failure — this is
-- what proves re-verification actually happened on each request, independent of
-- CMSNEO's own insertAction audit table (a separate DB.GetDB in the new app writes
-- to that too, but this table is specific to "was this recipient still allowed to
-- see this specific shared item at this specific moment").
CREATE OR ALTER PROCEDURE [dbo].[MBX_LogAccess]
	@MessageItemID INT,
	@ByUID INT,
	@Result VARCHAR(20),
	@DetailMsg NVARCHAR(500) = NULL
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

	INSERT INTO MBX_AccessLog (MessageItemID, ByUID, Result, DetailMsg)
	SELECT @MessageItemID, @ByUID, @Result, @DetailMsg
END
GO
