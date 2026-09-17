using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace CMSMailbox.Controllers
{
    // Shared bearer-token resolution for every authenticated controller in this app.
    // Mirrors CMS's HomeController.xUID() (Authorization header -> tokenAuth), but
    // this app has no session/UserToken fallback since there's no ASP.NET Session here.
    public abstract class MailboxControllerBase : Controller
    {
        // Returns 0 for a missing/invalid/expired token — callers MUST treat 0 as
        // "not authenticated" and fail closed, never as a valid UID.
        protected int CurrentUID()
        {
            string token = "";
            if (Request.Headers.TryGetValue(HeaderNames.Authorization, out var headerAuth))
            {
                var parts = headerAuth.FirstOrDefault()?.Split(' ');
                token = (parts != null && parts.Length > 1) ? parts[1] : "";
            }

            var uidStr = TokenGenerator.ValidateAndGetUID(token, out _);
            return int.TryParse(uidStr, out var uid) ? uid : 0;
        }
    }
}
