using System.Collections.Generic;
using System.Data;
using MailKit.Net.Smtp;
using MimeKit;

namespace CMSMailbox
{
    // Minimal port of CMS\sendMail.cs's csMail — only the new-IP verification email,
    // since that's the one piece of CMS's login flow this app's own login needs to
    // replicate. Reads the same NEO_NoReplyEmailCreds table CMS uses.
    public static class Mail
    {
        private static List<string> Creds()
        {
            List<string> creds = new List<string>();
            DataTable d = DB.GetDB("select * from NEO_NoReplyEmailCreds where active=1", 0, "{}");
            creds.Add(d.Rows[0]["MsgFromName"].ToString());
            creds.Add(d.Rows[0]["MsgFromAddr"].ToString());
            creds.Add(d.Rows[0]["MsgFromUser"].ToString());
            creds.Add(d.Rows[0]["MsgFromPwd"].ToString());
            return creds;
        }

        public static void SendIPAuth(string email, string auth)
        {
            var creds = Creds();

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(creds[0], creds[1]));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "CMS Mailbox IP Validation";
            message.Body = new TextPart("html")
            {
                Text = "<p>You have attempted to log in to the CMS Mailbox from an unknown location.</p>" +
                "<p>Please click the link below to validate this location and enter the site.</p>" +
                @"<p><a href=""" + DB.Url + @"/Validate?auth=" + auth + @""">Validate my IP Address</a></p>" +
                "<p style=\"color:red\">*** If you believe a login was attempted by someone other than yourself, please click the link below.</p>" +
                @"<p><a href=""" + DB.Url + @"/Validate?deny=" + auth + @""">Deny Validation from this IP Address</a></p>"
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587);
                client.Authenticate(creds[2], creds[3]);
                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}
