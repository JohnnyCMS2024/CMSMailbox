using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CMSMailbox.Controllers
{
    // Serves the "port-by-copy" IA record viewer: ia-viewer.html plus CMSNEO's own
    // InteractiveForm.js/global.js/etc (copied verbatim into wwwroot/js except two
    // small, documented adaptations — see the comments in those files) run unmodified
    // against the endpoints below instead of CMS's own main/adHoc.
    //
    // Security model: every action here re-derives (MainID, FormID) itself — from the
    // MessageItemID the client claims to be acting on for main/adHoc, or from the
    // MainID being requested for GetIAPDF — and re-runs BOTH gates before doing
    // anything else:
    //   Gate A: this recipient's own Team grant covers this specific FormID
    //           (NEO_NewSecurity's FormID column).
    //   Gate B: NEO_IAGetFormData actually returns rows for this uid/MainID/FormID
    //           (the real, confirmed-working per-record ACS check).
    // This repeats on every call, not just once at page load, so a recipient who loses
    // access mid-session is cut off on their very next request, not just their next login.
    public class IaViewerController : MailboxControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public IaViewerController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // Read-only IA actions the ported InteractiveForm.js's ViewDisp() render path
        // actually calls. Strict allowlist — anything else is refused regardless of
        // gate status, unlike CMS's own open main/adHoc dispatcher.
        private static readonly HashSet<string> ReadActions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "_IAGetFormData", "_IAGetJoinRecord", "_IAGetFieldMGTData", "_IAGetMultiAnswers",
            "_IAGetDataBlanks", "_IAGetSetAprovalBy", "_IAGetFilesNotes", "_IAGetAddtlInfo",
            "_IAGetCIDs", "_IAGetAddtlInfoEmails", "_GetCleanFilename", "_GetUserToken",
            "_IAGetDataByMainID", "_GetGUIDs"
        };

        // Write actions — unblocked 2026-09-22 once every one of these procs' own
        // ownership checks was reviewed/fixed (plan doc Section 7.2). Gated here the
        // same as reads: cheap insurance where the proc itself also checks now, and
        // mandatory for _IADocAssign, whose SQL layer deliberately has no check of its
        // own ("anyone with access to the record" — this dispatcher's gate IS the
        // access control for that one).
        //
        // Deliberately NOT included: _IALoadFiles (needs a separate multipart-upload
        // endpoint CMS uses adHocAttach for — not built here yet), _IADeleteRecord /
        // _IADeleteRecords / _IACloneNotesAttachments (record-management actions, out
        // of scope for a reply-only mailbox viewer), _IARecallSignature / DocuSign
        // send-for-signature (separate integration, not reviewed for this app).
        private static readonly HashSet<string> WriteActions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "_IASubmitDataByGen300_2", "_IALockRecord", "_IADelFileNote",
            "_IAAcceptAddtlInfo", "_IAGetSetSystemLinks", "_IADocAssign", "_IALoadNotes"
        };

        [HttpGet("item/{messageItemId:int}/bootstrap")]
        public IActionResult Bootstrap(int messageItemId)
        {
            int uid = CurrentUID();
            if (uid == 0) return Unauthorized();

            var ctx = ResolveAndGateByMessageItem(messageItemId, uid);
            if (ctx == null) return NotFound();

            var creds = DB.GetDB("exec NEO_GetMGTCID @uid", uid);
            var security = DB.GetDB("exec NEO_NewSecurity @uid", uid);

            // ViewDispGO reads several fields (Application_Type, hasDoc, strMainID, its
            // own echoed FormID, ...) off the "js" object InteractiveForm.js's ViewDisp()
            // builds by matching jsNeo.jsALL against a report-grid row — normally loaded
            // by CMS's own list view via NEO_IAGETALLDATA260903 before ViewDisp() ever
            // runs. Those specific fields are NOT present in NEO_IAGetFormData's rows
            // (confirmed against InteractiveForm.js's own "excludeFields" list, ~line
            // 696, which pulls exactly this field set out of that report proc's pivoted
            // "Values"/"ShortNames" rows). This standalone viewer has no report grid, so
            // it calls the same report proc itself, scoped to just this one MainID
            // (GETCACHE=0 so it can't rely on report state we never built), and hands
            // the raw pivoted rows to the client to unpivot the same way ViewDisp()'s
            // own report-loading code already does.
            var reportRaw = DB.GetDB("exec NEO_IAGETALLDATA260903 @uid, @formid, @FilterID, @MainID, @GETCACHE", uid,
                "{\"formid\":\"" + ctx.FormId + "\",\"FilterID\":0,\"MainID\":" + ctx.MainId + ",\"GETCACHE\":0}");

            return Ok(new
            {
                ok = true,
                mainId = ctx.MainId,
                formId = ctx.FormId,
                reportRaw = JsonConvert.SerializeObject(reportRaw),
                myCID = creds.Rows.Count > 0 ? creds.Rows[0]["MyCID"] : null,
                mgtCID = creds.Rows.Count > 0 ? creds.Rows[0]["MgtCID"] : null,
                isMGT = creds.Rows.Count > 0 && creds.Rows[0]["isMGT"] != DBNull.Value && Convert.ToInt32(creds.Rows[0]["isMGT"]) == 1,
                myUID = uid,
                security = JsonConvert.SerializeObject(security)
            });
        }

        // Mirrors CMS's own main/adHoc shape exactly (action/strjson/csrf form fields)
        // so the copied ajax.js/global.js work unmodified — "csrf" is accepted but
        // never checked; bearer JWT is this app's real auth. The one intentional
        // addition, "messageItemId", is injected by the patched newFormData() in the
        // copied global.js (see that file) and is what lets this dispatcher re-derive
        // the record context itself instead of trusting the client's own mainid/
        // recordid fields.
        [HttpPost("main/adHoc")]
        public IActionResult AdHoc(string action, string strjson, string csrf, int messageItemId)
        {
            int uid = CurrentUID();
            if (uid == 0) return Content("[]");

            var ctx = ResolveAndGateByMessageItem(messageItemId, uid);
            if (ctx == null) return Content("[]");

            bool allowed = ReadActions.Contains(action ?? "") || WriteActions.Contains(action ?? "");
            if (!allowed)
            {
                LogAccess(messageItemId, uid, "Denied", "action not on allowlist: " + action);
                return Content("[]");
            }

            var jo = string.IsNullOrEmpty(strjson) ? new JObject() : JObject.Parse(strjson);

            // ViewDisp() only ever calls this with an empty Fieldname (read mode) —
            // NEO_IAGetSetAprovalBy has an unguarded write branch when Fieldname is
            // non-empty (plan doc Section 6.2), so refuse that outright rather than
            // trust the client never to send one.
            if (string.Equals(action, "_IAGetSetAprovalBy", StringComparison.OrdinalIgnoreCase))
            {
                var fieldname = jo["Fieldname"]?.ToString() ?? "";
                if (fieldname != "")
                {
                    LogAccess(messageItemId, uid, "Denied", "_IAGetSetAprovalBy write branch blocked");
                    return Content("[]");
                }
            }

            string strParams = "";
            foreach (var key in jo) strParams += ", @" + key.Key;

            string sql = "exec NEO" + action + " @uid" + strParams;
            var dat = DB.GetDB(sql, uid, strjson ?? "");

            LogAccess(messageItemId, uid, "Served", action);
            return Content(JsonConvert.SerializeObject(dat), "application/json");
        }

        // Proxies CMSNEO's own PDF export rather than reimplementing GemBox/DocuSign
        // here. CMSMailbox re-verifies access itself (by MainID, since the ported
        // exportDoc() builds this iframe src without a messageItemId), then asks
        // CMSNEO to build the PDF using the RECIPIENT's own uid — never the sender's —
        // exactly as if that recipient had opened the record in CMSNEO directly.
        [HttpGet("GetIAPDF")]
        public async Task<IActionResult> GetIAPDF(int MainID, string filename, string token = "")
        {
            int uid = ResolveOneOffUid(token);
            if (uid == 0) return NotFound();

            string formId = LookupFormIdForMainId(uid, MainID);
            if (formId == null || !PassesGates(uid, MainID, formId))
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(DB.CmsUrl)) return NotFound();

            // Mint a fresh one-off token for the outbound call rather than forwarding
            // the client-supplied one, in case NEO_GetUserToken tokens are single-use.
            var mint = DB.GetDB("exec NEO_GetUserToken @uid", uid);
            string freshToken = (mint.Rows.Count > 0 && mint.Columns.Contains("Token")) ? mint.Rows[0]["Token"].ToString() : null;
            if (string.IsNullOrEmpty(freshToken)) return NotFound();

            var client = _httpClientFactory.CreateClient("CmsProxy");
            string url = DB.CmsUrl.TrimEnd('/') + "/GetIAPDF?MainID=" + MainID +
                "&filename=" + Uri.EscapeDataString(filename ?? "") +
                "&token=" + Uri.EscapeDataString(freshToken);

            HttpResponseMessage resp;
            try { resp = await client.GetAsync(url); }
            catch { return NotFound(); }

            if (!resp.IsSuccessStatusCode) return NotFound();

            var bytes = await resp.Content.ReadAsByteArrayAsync();
            return File(bytes, "application/pdf");
        }

        // Proxies CMSNEO's own attachment viewer/download route the same way
        // GetIAPDF proxies the PDF export. Unlike MainID, an attachment's fid has no
        // natural-key lookup into MBX_MessageItem, so this is gated by messageItemId
        // instead (added explicitly by the ported FileViewer.js — see that file) —
        // proves the recipient currently has SOME gated-open IAFormRecord item, the
        // same trust boundary GetIAPDF relies on for its own one-off token mint.
        [HttpGet("DownloadIA")]
        public async Task<IActionResult> DownloadIA(string fid, int dl, string token, int messageItemId)
        {
            int uid = ResolveOneOffUid(token);
            if (uid == 0) return NotFound();

            var ctx = ResolveAndGateByMessageItem(messageItemId, uid);
            if (ctx == null) return NotFound();

            if (string.IsNullOrEmpty(DB.CmsUrl)) return NotFound();

            var mint = DB.GetDB("exec NEO_GetUserToken @uid", uid);
            string freshToken = (mint.Rows.Count > 0 && mint.Columns.Contains("Token")) ? mint.Rows[0]["Token"].ToString() : null;
            if (string.IsNullOrEmpty(freshToken)) return NotFound();

            var client = _httpClientFactory.CreateClient("CmsProxy");
            string url = DB.CmsUrl.TrimEnd('/') + "/DownloadIA?fid=" + Uri.EscapeDataString(fid ?? "") +
                "&dl=" + dl + "&token=" + Uri.EscapeDataString(freshToken);

            HttpResponseMessage resp;
            try { resp = await client.GetAsync(url); }
            catch { return NotFound(); }

            if (!resp.IsSuccessStatusCode) return NotFound();

            var bytes = await resp.Content.ReadAsByteArrayAsync();
            string contentType = resp.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
            return File(bytes, contentType);
        }

        // The ported SubmitRecord()'s save flow stages field changes into
        // NEO_GetGeneric300 via this endpoint BEFORE calling _IASubmitDataByGen300_2
        // through the gated main/adHoc dispatcher above — CMS's own HomeController.cs
        // has an identical LoadGeneric300 action (~line 5600) that this replicates.
        // This call is built directly (`new FormData()`, not newFormData()) by the
        // ported InteractiveForm.js, so it carries messageItemId via a small,
        // documented patch to that file rather than the shared helper.
        //
        // Staging alone doesn't write anything to the real record — that only
        // happens when _IASubmitDataByGen300_2 reads this back by (@uid, @type) and
        // applies NEOGen3AuthorizedFields' own per-CID field filter (the user's own
        // fix, see plan doc Section 7.2). Still gated the same as every other action
        // here, consistent with "cheap insurance even where the real check is
        // downstream."
        [HttpPost("LoadGeneric300")]
        public IActionResult LoadGeneric300(string strJson, string type, int messageItemId)
        {
            int uid = CurrentUID();
            if (uid == 0) return Content("[]");

            var ctx = ResolveAndGateByMessageItem(messageItemId, uid);
            if (ctx == null) return Content("[]");

            if (string.IsNullOrEmpty(strJson)) return Content("[]");
            var arr = JArray.Parse(strJson);
            if (arr.Count == 0) return Content("[]");

            var first = (JObject)arr[0];
            var hdrs = first.Properties().Select(p => p.Name.Replace("|", "").Replace("~", "")).ToList();
            var rows = new List<string> { string.Join("|", hdrs) };
            foreach (var item in arr)
            {
                var jo = (JObject)item;
                var cols = hdrs.Select(h => (jo[h]?.ToString() ?? "").Replace("|", "").Replace("~", ""));
                rows.Add(string.Join("|", cols));
            }

            var dat = DB.GetDB("exec NEO_GetGeneric300 @uid, @rows, @type", uid,
                JsonConvert.SerializeObject(new JObject
                {
                    ["rows"] = string.Join("~", rows),
                    ["type"] = type ?? ""
                }));

            return Content(JsonConvert.SerializeObject(dat), "application/json");
        }

        private class ItemContext { public int MainId; public string FormId; }

        private ItemContext ResolveAndGateByMessageItem(int messageItemId, int uid)
        {
            var lookup = DB.GetDB(
                "select mi.ItemType, mi.ItemID, mi.FormID from MBX_MessageItem mi " +
                "join MBX_Recipient r on r.MessageID = mi.MessageID and r.ToUID = @uid " +
                "where mi.MessageItemID = @messageItemId",
                uid, "{\"messageItemId\":" + messageItemId + "}");

            if (lookup.Rows.Count == 0 || lookup.Columns.Contains("err") ||
                lookup.Rows[0]["ItemType"].ToString() != "IAFormRecord")
            {
                LogAccess(messageItemId, uid, "Denied", "not a recipient or not an IAFormRecord item");
                return null;
            }

            string formId = lookup.Rows[0]["FormID"]?.ToString();
            if (string.IsNullOrEmpty(formId) || !int.TryParse(lookup.Rows[0]["ItemID"].ToString(), out int mainId) || mainId <= 0)
            {
                LogAccess(messageItemId, uid, "Error", "missing/invalid FormID or MainID on IAFormRecord item");
                return null;
            }

            if (!PassesGates(uid, mainId, formId))
            {
                LogAccess(messageItemId, uid, "Denied", "failed Gate A/Gate B");
                return null;
            }

            return new ItemContext { MainId = mainId, FormId = formId };
        }

        // Used only by GetIAPDF, which receives a MainID but no MessageItemID (the
        // ported exportDoc() builds that iframe src without one). ItemType+ItemID is
        // already a natural key into this recipient's own shared IA items, so this
        // re-derives the same FormID a messageItemId lookup would without needing one.
        private string LookupFormIdForMainId(int uid, int mainId)
        {
            var lookup = DB.GetDB(
                "select top 1 mi.FormID from MBX_MessageItem mi " +
                "join MBX_Recipient r on r.MessageID = mi.MessageID and r.ToUID = @uid " +
                "where mi.ItemType = 'IAFormRecord' and mi.ItemID = @mainId",
                uid, "{\"mainId\":\"" + mainId + "\"}");

            if (lookup.Rows.Count == 0 || lookup.Columns.Contains("err")) return null;
            return lookup.Rows[0]["FormID"]?.ToString();
        }

        private bool PassesGates(int uid, int mainId, string formId)
        {
            if (string.IsNullOrEmpty(formId)) return false;

            var security = DB.GetDB("exec NEO_NewSecurity @uid", uid);
            bool formPermitted = security.Columns.Contains("FormID") &&
                security.Rows.Cast<DataRow>().Any(r => r["FormID"] != DBNull.Value && r["FormID"].ToString() == formId);
            if (!formPermitted) return false;

            var formData = DB.GetDB("exec NEO_IAGetFormData @uid, @MainID, @FormID", uid,
                "{\"MainID\":" + mainId + ",\"FormID\":\"" + formId + "\"}");

            return formData.Rows.Count > 0 && !formData.Columns.Contains("err");
        }

        // Looks up the UID for a one-off token minted via NEO_GetUserToken — same
        // shared-table lookup CMS's own zUID() does — never a JWT decode.
        private int ResolveOneOffUid(string token)
        {
            if (string.IsNullOrEmpty(token)) return 0;
            var dat = DB.GetDB("exec NEO_GetUserToken @uid, @token", 0, "{\"token\":\"" + token + "\"}");
            if (dat.Rows.Count == 0 || dat.Columns.Contains("err") || !dat.Columns.Contains("UID")) return 0;
            try { return Convert.ToInt32(dat.Rows[0]["UID"]); } catch { return 0; }
        }

        private static void LogAccess(int messageItemId, int uid, string result, string detail)
        {
            DB.GetDB("exec MBX_LogAccess @messageItemId, @byUid, @result, @detail", uid,
                "{\"messageItemId\":" + messageItemId + ",\"byUid\":" + uid +
                ",\"result\":\"" + result + "\",\"detail\":\"" + (detail ?? "").Replace("\"", "'") + "\"}");
        }
    }
}
