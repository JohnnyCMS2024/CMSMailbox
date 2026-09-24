/*
	A reply to a message that referenced a Form Application record should keep
	referencing that same record, so the recipient can still see/act on it without
	having to dig up the original message. Scoped to IAFormRecord items only — other
	item types (File/FollowupAttachment/etc.) are not carried forward, since only
	Form Application records were asked for here.

	Run against dev/QA after 001/002/003. See plan doc for the rest of the design.
*/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[MBX_SendReply]
	@UID INT,
	@ReplyToMessageID INT,
	@Subject NVARCHAR(255),
	@Body NVARCHAR(MAX) = NULL
AS
BEGIN
	SET ARITHABORT ON
	SET NOCOUNT ON

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

	-- Carry forward the Form Application record(s), if any, from the message being
	-- replied to. This is a NEW MBX_MessageItem row on the reply (not a shared
	-- reference to the old one) — access is still independently re-verified at open
	-- time regardless, same as any other item, so duplicating the pointer costs
	-- nothing security-wise and keeps each message's item list self-contained.
	INSERT INTO MBX_MessageItem (MessageID, ItemType, ItemID, ItemLabel, OwnerCID, FormID)
	SELECT @NewMessageID, mi.ItemType, mi.ItemID, mi.ItemLabel, mi.OwnerCID, mi.FormID
	FROM MBX_MessageItem mi
	WHERE mi.MessageID = @ReplyToMessageID AND mi.ItemType = 'IAFormRecord'

	SELECT @NewMessageID AS MessageID
END
GO
