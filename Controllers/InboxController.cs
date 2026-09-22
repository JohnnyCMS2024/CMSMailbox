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

        // Listing only — who this user is even allowed to reply to. This does NOT
        // itself authorize anything; MBX_SendReply independently re-derives the
        // allowed recipient set from the thread being replied to, so a forged/stale
        // client-side list can't be used to reach someone who isn't a real participant.
        [HttpGet("prior-senders")]
        public IActionResult GetPriorSenders()
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            var dat = DB.GetDB("exec MBX_GetPriorSenders @uid", uid);
            return Ok(JsonConvert.SerializeObject(dat));
        }

        // CMSMailbox has no "new message" compose at all — every send here is a reply
        // within an existing thread. Recipients are always derived server-side from
        // the thread's own participants (see MBX_SendReply); there is no parameter for
        // an arbitrary recipient list, by design, since that's what makes "recipients
        // may only message prior senders" hold without a separate allowlist check.
        // Attaching a Form Application (or any item) from CMSMailbox is not supported
        // here either — composing/attaching only happens via CMSNEO's own share flow.
        [HttpPost("{messageId:int}/reply")]
        public IActionResult Reply(int messageId, [FromBody] ReplyRequest req)
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            var dat = DB.GetDB("exec MBX_SendReply @uid, @replyToMessageId, @subject, @body", uid,
                new Newtonsoft.Json.Linq.JObject
                {
                    ["replyToMessageId"] = messageId,
                    ["subject"] = req.Subject ?? "",
                    ["body"] = req.Body ?? ""
                }.ToString());

            if (dat.Rows.Count == 0 || dat.Columns.Contains("err"))
            {
                // Same response whether the thread doesn't exist or uid isn't a
                // participant of it — MBX_SendReply's own guard returns no rows either way.
                return BadRequest();
            }

            return Ok(JsonConvert.SerializeObject(dat));
        }
    }

    public class ArchiveRequest
    {
        public bool Archived { get; set; }
    }

    public class ReplyRequest
    {
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
