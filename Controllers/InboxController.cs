using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CMSMailbox.Controllers
{
    [Route("inbox")]
    public class InboxController : MailboxControllerBase
    {
        [HttpGet("")]
        public IActionResult GetInbox()
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            var dat = DB.GetDB("exec MBX_GetInbox @uid", uid);
            return Ok(JsonConvert.SerializeObject(dat));
        }

        // Returns the message header + its item list (ItemType/ItemID/ItemLabel only —
        // no bytes here; bytes are only ever served by ItemController after a fresh
        // per-item access re-check). MBX_GetMessage itself gates on the caller
        // actually being a recipient of this message.
        [HttpGet("{messageId:int}")]
        public IActionResult GetMessage(int messageId)
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            var ds = DB.GetDBSet("exec MBX_GetMessage @uid, @messageId", uid, "{\"messageId\":" + messageId + "}");
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                // Same table whether the message doesn't exist or this UID isn't a
                // recipient of it — never confirm which.
                return NotFound();
            }

            DB.GetDB("exec MBX_MarkRead @uid, @messageId", uid, "{\"messageId\":" + messageId + "}");

            return Ok(new
            {
                message = JsonConvert.SerializeObject(ds.Tables[0]),
                items = ds.Tables.Count > 1 ? JsonConvert.SerializeObject(ds.Tables[1]) : "[]"
            });
        }

        [HttpPost("{messageId:int}/archive")]
        public IActionResult SetArchived(int messageId, [FromBody] ArchiveRequest req)
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            DB.GetDB("exec MBX_MarkArchived @uid, @messageId, @archived", uid,
                "{\"messageId\":" + messageId + ",\"archived\":" + (req.Archived ? 1 : 0) + "}");
            return Ok();
        }
    }

    public class ArchiveRequest
    {
        public bool Archived { get; set; }
    }
}
