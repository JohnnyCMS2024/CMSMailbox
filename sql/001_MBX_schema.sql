/*
	MBX_* schema — CMSMailbox companion app.

	Deliberately prefixed MBX_ to avoid any collision with the existing, unrelated
	NEO_Mail/NEO_Mailbox* internal messaging feature (NEO_GetMailbox, NEO_SendMail, etc.).

	Lives in the SAME database as Users/Companies/Groups/Teams/AccessTree — this app
	does not get its own database. Run this against dev first.
*/

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MBX_Message](
	[MessageID] [int] IDENTITY(1,1) NOT NULL,
	[FromUID] [int] NOT NULL,
	[FromCID] [int] NOT NULL,
	[Subject] [nvarchar](255) NOT NULL,
	[Body] [nvarchar](max) NULL,
	[DTCreated] [datetime] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[DTDeleted] [datetime] NULL,
 CONSTRAINT [PK_MBX_Message] PRIMARY KEY CLUSTERED
(
	[MessageID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MBX_Message] ADD CONSTRAINT [DF_MBX_Message_DTCreated] DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[MBX_Message] ADD CONSTRAINT [DF_MBX_Message_IsDeleted] DEFAULT ((0)) FOR [IsDeleted]
GO

ALTER TABLE [dbo].[MBX_Message] WITH CHECK ADD CONSTRAINT [FK_MBX_Message_Users] FOREIGN KEY([FromUID])
REFERENCES [dbo].[Users] ([UID])
GO
ALTER TABLE [dbo].[MBX_Message] CHECK CONSTRAINT [FK_MBX_Message_Users]
GO

ALTER TABLE [dbo].[MBX_Message] WITH CHECK ADD CONSTRAINT [FK_MBX_Message_Companies] FOREIGN KEY([FromCID])
REFERENCES [dbo].[Companies] ([CID])
GO
ALTER TABLE [dbo].[MBX_Message] CHECK CONSTRAINT [FK_MBX_Message_Companies]
GO


CREATE TABLE [dbo].[MBX_Recipient](
	[RecipientID] [int] IDENTITY(1,1) NOT NULL,
	[MessageID] [int] NOT NULL,
	[ToUID] [int] NOT NULL,
	[ToCID] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[DTViewed] [datetime] NULL,
	[IsArchived] [bit] NOT NULL,
 CONSTRAINT [PK_MBX_Recipient] PRIMARY KEY CLUSTERED
(
	[RecipientID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MBX_Recipient] ADD CONSTRAINT [DF_MBX_Recipient_DTCreated] DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[MBX_Recipient] ADD CONSTRAINT [DF_MBX_Recipient_IsArchived] DEFAULT ((0)) FOR [IsArchived]
GO

ALTER TABLE [dbo].[MBX_Recipient] WITH CHECK ADD CONSTRAINT [FK_MBX_Recipient_MBX_Message] FOREIGN KEY([MessageID])
REFERENCES [dbo].[MBX_Message] ([MessageID])
GO
ALTER TABLE [dbo].[MBX_Recipient] CHECK CONSTRAINT [FK_MBX_Recipient_MBX_Message]
GO

ALTER TABLE [dbo].[MBX_Recipient] WITH CHECK ADD CONSTRAINT [FK_MBX_Recipient_Users] FOREIGN KEY([ToUID])
REFERENCES [dbo].[Users] ([UID])
GO
ALTER TABLE [dbo].[MBX_Recipient] CHECK CONSTRAINT [FK_MBX_Recipient_Users]
GO

ALTER TABLE [dbo].[MBX_Recipient] WITH CHECK ADD CONSTRAINT [FK_MBX_Recipient_Companies] FOREIGN KEY([ToCID])
REFERENCES [dbo].[Companies] ([CID])
GO
ALTER TABLE [dbo].[MBX_Recipient] CHECK CONSTRAINT [FK_MBX_Recipient_Companies]
GO

-- A user should only receive a given message once.
CREATE UNIQUE NONCLUSTERED INDEX [UX_MBX_Recipient_Message_ToUID] ON [dbo].[MBX_Recipient]
(
	[MessageID] ASC,
	[ToUID] ASC
)
GO


CREATE TABLE [dbo].[MBX_MessageItem](
	[MessageItemID] [int] IDENTITY(1,1) NOT NULL,
	[MessageID] [int] NOT NULL,
	[ItemType] [varchar](20) NOT NULL,
	[ItemID] [nvarchar](50) NOT NULL,
	[ItemLabel] [nvarchar](255) NULL,
	[OwnerCID] [int] NULL,
	[DTCreated] [datetime] NOT NULL,
 CONSTRAINT [PK_MBX_MessageItem] PRIMARY KEY CLUSTERED
(
	[MessageItemID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MBX_MessageItem] ADD CONSTRAINT [DF_MBX_MessageItem_DTCreated] DEFAULT (getdate()) FOR [DTCreated]
GO

ALTER TABLE [dbo].[MBX_MessageItem] WITH CHECK ADD CONSTRAINT [FK_MBX_MessageItem_MBX_Message] FOREIGN KEY([MessageID])
REFERENCES [dbo].[MBX_Message] ([MessageID])
GO
ALTER TABLE [dbo].[MBX_MessageItem] CHECK CONSTRAINT [FK_MBX_MessageItem_MBX_Message]
GO

-- Controlled vocabulary. "Application" is deliberately NOT included yet — see
-- ApplicationFileViewer access-control gap tracked separately (HomeController.cs ~3954).
-- Add 'Application' here only once that's fixed.
ALTER TABLE [dbo].[MBX_MessageItem] WITH CHECK ADD CONSTRAINT [CK_MBX_MessageItem_ItemType]
CHECK ([ItemType] IN ('File','FollowupAttachment','IAField','DRField','ExamFile'))
GO
ALTER TABLE [dbo].[MBX_MessageItem] CHECK CONSTRAINT [CK_MBX_MessageItem_ItemType]
GO

CREATE NONCLUSTERED INDEX [IX_MBX_MessageItem_ItemType_ItemID] ON [dbo].[MBX_MessageItem]
(
	[ItemType] ASC,
	[ItemID] ASC
)
GO


CREATE TABLE [dbo].[MBX_AccessLog](
	[AccessLogID] [int] IDENTITY(1,1) NOT NULL,
	[MessageItemID] [int] NOT NULL,
	[ByUID] [int] NOT NULL,
	[DTAttempted] [datetime] NOT NULL,
	[Result] [varchar](20) NOT NULL,
	[DetailMsg] [nvarchar](500) NULL,
 CONSTRAINT [PK_MBX_AccessLog] PRIMARY KEY CLUSTERED
(
	[AccessLogID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MBX_AccessLog] ADD CONSTRAINT [DF_MBX_AccessLog_DTAttempted] DEFAULT (getdate()) FOR [DTAttempted]
GO

ALTER TABLE [dbo].[MBX_AccessLog] WITH CHECK ADD CONSTRAINT [FK_MBX_AccessLog_MBX_MessageItem] FOREIGN KEY([MessageItemID])
REFERENCES [dbo].[MBX_MessageItem] ([MessageItemID])
GO
ALTER TABLE [dbo].[MBX_AccessLog] CHECK CONSTRAINT [FK_MBX_AccessLog_MBX_MessageItem]
GO

ALTER TABLE [dbo].[MBX_AccessLog] WITH CHECK ADD CONSTRAINT [FK_MBX_AccessLog_Users] FOREIGN KEY([ByUID])
REFERENCES [dbo].[Users] ([UID])
GO
ALTER TABLE [dbo].[MBX_AccessLog] CHECK CONSTRAINT [FK_MBX_AccessLog_Users]
GO

ALTER TABLE [dbo].[MBX_AccessLog] WITH CHECK ADD CONSTRAINT [CK_MBX_AccessLog_Result]
CHECK ([Result] IN ('Served','Denied','Error'))
GO
ALTER TABLE [dbo].[MBX_AccessLog] CHECK CONSTRAINT [CK_MBX_AccessLog_Result]
GO

CREATE NONCLUSTERED INDEX [IX_MBX_AccessLog_MessageItemID] ON [dbo].[MBX_AccessLog]
(
	[MessageItemID] ASC
)
GO
