using System;
using System.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMSMailbox.Controllers
{
    // The core security boundary of this whole app (see plan doc Section 4). Every
    // item open re-verifies the CALLER's own current CMSNEO permissions by calling the
    // exact same stored procedure CMSNEO's own viewer for that item type calls,
    // passing the RECIPIENT's own UID — never the sender's, never a bypass. A message
    // existing is never treated as authorization by itself.
    [Route("item")]
    public class ItemController : MailboxControllerBase
    {
        // NOTE: column names for the bytes/filename returned by each existing CMSNEO
        // proc were inferred from HomeController.cs call sites, not from the proc
        // bodies themselves (not in this repo) — confirm exact column names against
        // the live procs during implementation/testing before shipping.
        [HttpGet("{messageItemId:int}")]
        public IActionResult GetItem(int messageItemId)
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            // Gate 1: this item must belong to a message this UID actually received.
            var lookup = DB.GetDB(
                "select mi.ItemType, mi.ItemID from MBX_MessageItem mi " +
                "join MBX_Recipient r on r.MessageID = mi.MessageID and r.ToUID = @uid " +
                "where mi.MessageItemID = @messageItemId",
                uid, "{\"messageItemId\":" + messageItemId + "}");

            if (lookup.Rows.Count == 0 || lookup.Columns.Contains("err"))
            {
                LogAccess(messageItemId, uid, "Denied", "not a recipient or item not found");
                return NotFound();
            }

            string itemType = lookup.Rows[0]["ItemType"].ToString();
            string itemId = lookup.Rows[0]["ItemID"].ToString();

            // Gate 2: re-verify against CMSNEO's OWN access rules for this item type,
            // right now, using the recipient's own uid.
            DataTable dat;
            switch (itemType)
            {
                case "File":
                    dat = DB.GetDB("exec Neo_GetFile @uid, @fid", uid, "{\"fid\":" + itemId + "}");
                    break;
                case "FollowupAttachment":
                    dat = DB.GetDB("exec NEO_GetFollowupAttachment @uid, @attachID", uid, "{\"attachID\":\"" + itemId + "\"}");
                    break;
                case "IAField":
                    dat = DB.GetDB("exec NEO_IAGetDownloadFile @uid, @fieldid", uid, "{\"fieldid\":\"" + itemId + "\"}");
                    break;
                case "DRField":
                    dat = DB.GetDB("exec NEO_DRGetDownloadFile @uid, @fieldid", uid, "{\"fieldid\":\"" + itemId + "\"}");
                    break;
                case "ExamFile":
                    dat = DB.GetDB("exec NEO_MGTGetDoc @uid, @fid", uid, "{\"fid\":" + itemId + "}");
                    break;
                default:
                    // 'Application' and anything else not yet supported — see plan doc
                    // Section 0 (ApplicationFileViewer access-control gap).
                    LogAccess(messageItemId, uid, "Denied", "unsupported item type: " + itemType);
                    return NotFound();
            }

            if (dat.Rows.Count == 0 || dat.Columns.Contains("err"))
            {
                LogAccess(messageItemId, uid, "Denied", "underlying proc returned no rows or an error — access revoked or never valid");
                return NotFound();
            }

            byte[] bytes = FindBytesColumn(dat.Rows[0]);
            if (bytes == null)
            {
                LogAccess(messageItemId, uid, "Error", "no recognizable byte column in proc result");
                return NotFound();
            }

            string filename = FindFilenameColumn(dat.Rows[0]) ?? ("item_" + itemId);

            LogAccess(messageItemId, uid, "Served", null);
            return File(bytes, "application/octet-stream", filename);
        }

        private static byte[] FindBytesColumn(DataRow row)
        {
            foreach (var col in new[] { "FileData", "Filedata", "DocData" })
            {
                if (row.Table.Columns.Contains(col) && row[col] is byte[] b) return b;
            }
            return null;
        }

        private static string FindFilenameColumn(DataRow row)
        {
            foreach (var col in new[] { "Filename", "FileName", "DocName" })
            {
                if (row.Table.Columns.Contains(col)) return row[col]?.ToString();
            }
            return null;
        }

        private static void LogAccess(int messageItemId, int uid, string result, string detail)
        {
            DB.GetDB("exec MBX_LogAccess @messageItemId, @byUid, @result, @detail", uid,
                "{\"messageItemId\":" + messageItemId + ",\"byUid\":" + uid +
                ",\"result\":\"" + result + "\",\"detail\":\"" + (detail ?? "") + "\"}");
        }
    }
}
