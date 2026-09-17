using System;
using Google.Authenticator;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CMSMailbox.Controllers
{
    // Independent login implementation (not SSO with CMSNEO) that authenticates
    // against the SAME Users table and the SAME NEO_Login/2FA/IP-verification stored
    // procedures CMSNEO uses, so an account's password and already-enrolled TOTP
    // secret work identically on both apps. See CMS\Controllers\HomeController.cs
    // doLogin/Verify2FA (~line 152-339) for the flow this mirrors.
    //
    // Unlike CMS, there is no ASP.NET Session involved anywhere in this flow — the
    // login->2FA handoff uses a short-lived signed "pending" token instead (see
    // TokenGenerator.GeneratePendingMfaToken), and a successful 2FA check issues this
    // app's own session JWT directly.
    [Route("auth")]
    public class AuthController : Controller
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";
            string u = (req.Username ?? "").Replace("'", "");
            string p = (req.Password ?? "").Replace("'", "");
            string data = @"{U: '" + u + @"',P: '" + p + @"', IP: '" + ip + @"'}";

            var dat = DB.GetDB("exec NEO_Login @U, @P, @IP", 0, data);
            if (dat.Rows.Count == 0)
            {
                return Ok(new { status = "error" });
            }

            string errmsg;
            try { errmsg = dat.Rows[0]["err"].ToString(); } catch { errmsg = null; }
            if (errmsg != null)
            {
                return Ok(new { status = "error" });
            }

            string resultMsg;
            try { resultMsg = dat.Rows[0]["msg"].ToString(); } catch { resultMsg = ""; }

            if (resultMsg == "IP")
            {
                string auth = dat.Rows[0]["auth"].ToString();
                string ipEmail = dat.Rows[0]["email"].ToString();
                Mail.SendIPAuth(ipEmail, auth);
                return Ok(new { status = "bad_ip" });
            }

            if (resultMsg != "welcome")
            {
                return Ok(new { status = "bad_login" });
            }

            string strUID = dat.Rows[0]["uid"].ToString();
            string email = dat.Rows[0]["email"].ToString();
            string mfaToken = dat.Rows[0]["mfaToken"].ToString();
            string useMfaToken = dat.Rows[0]["useMfaToken"].ToString();

            var tfa = new TwoFactorAuthenticator();
            string uniqueKeyForUser = useMfaToken + DB.GmfaKey;
            SetupCode setupInfo = tfa.GenerateSetupCode("CMSMailbox", email, uniqueKeyForUser, false, 3);
            string barcodeUrl = (mfaToken == "") ? setupInfo.QrCodeSetupImageUrl : null;

            var tg = new TokenGenerator();
            string pendingToken = tg.GeneratePendingMfaToken(strUID, useMfaToken, email);

            return Ok(new { status = "mfa_required", pendingToken, barcodeUrl });
        }

        [HttpPost("verify2fa")]
        public IActionResult Verify2FA([FromBody] Verify2FARequest req)
        {
            if (!TokenGenerator.ValidatePendingMfaToken(req.PendingToken, out var uid, out var useMfaToken, out var email))
            {
                return Ok(new { status = "invalid_or_expired" });
            }

            var tfa = new TwoFactorAuthenticator();
            string uniqueKeyForUser = useMfaToken + DB.GmfaKey;
            bool isValid = tfa.ValidateTwoFactorPIN(uniqueKeyForUser, req.Passcode, TimeSpan.FromSeconds(5));

            if (!isValid)
            {
                return Ok(new { status = "invalid_passcode" });
            }

            DB.GetDB("exec NEO_UpdateUserMFA @email, @mfaToken", 0,
                new JObject { ["email"] = email, ["mfaToken"] = useMfaToken }.ToString());

            var tg = new TokenGenerator();
            string token = tg.GenerateToken(uid);

            return Ok(new { status = "ok", token });
        }

        // Mirrors CMS's Validate action (HomeController.cs ~4445) for the new-IP
        // verification email link, against the same a_Suite_ValidateIP proc.
        [HttpGet("/Validate")]
        public IActionResult Validate(string auth, string deny)
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";
            bool isValid = false, isDenied = false;

            if (auth != null)
            {
                var dat = DB.GetDB("exec a_Suite_ValidateIP @ip, @auth", 0, "{\"ip\":\"" + ip + "\",\"auth\":\"" + auth + "\"}");
                if (dat.Rows.Count > 0) isValid = (bool)dat.Rows[0]["isValid"];
            }
            else if (deny != null)
            {
                DB.GetDB("exec a_Suite_DenyIPValidation @ip, @deny", 0, "{\"ip\":\"" + ip + "\",\"deny\":\"" + deny + "\"}");
                isDenied = true;
            }

            return Ok(new { isValid, isDenied });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class Verify2FARequest
    {
        public string PendingToken { get; set; }
        public string Passcode { get; set; }
    }
}
