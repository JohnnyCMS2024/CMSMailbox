using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace CMSMailbox
{
    // Same shape as CMS\TokenGenerator.cs, deliberately using a DIFFERENT signing key
    // (DB.JWT_Key, sourced from this app's own AppSettings:JwtSigningKey) — tokens
    // issued by CMSMailbox must never validate against CMSNEO or vice versa, since
    // login here is independent, not SSO.
    public class TokenGenerator
    {
        private static byte[] SigningKeyBytes => System.Text.Encoding.UTF8.GetBytes(DB.JWT_Key);

        public string GenerateToken(string UserID)
        {
            var TokenHandler = new JwtSecurityTokenHandler();
            var Claims = new List<System.Security.Claims.Claim>
                    {
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Sub, UserID)
                    };

            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(Claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                Issuer = DB.Url,
                Audience = DB.Url,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(SigningKeyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = TokenHandler.CreateToken(TokenDescriptor);
            return TokenHandler.WriteToken(token);
        }

        // Short-lived (5 min), purpose-scoped token that carries a user through the
        // login -> 2FA handoff WITHOUT any server-side session state (no ASP.NET
        // Session, no temp DB record). It embeds useMfaToken/email so the 2FA step can
        // validate the passcode without re-querying NEO_Login. The "purpose" claim
        // prevents this token from ever being accepted as a real session token by
        // ValidateAndGetUID (which doesn't check purpose, so callers MUST use
        // ValidatePendingMfaToken for this flow, never treat this as a bearer token).
        public string GeneratePendingMfaToken(string userID, string useMfaToken, string email)
        {
            var handler = new JwtSecurityTokenHandler();
            var claims = new List<System.Security.Claims.Claim>
                    {
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Sub, userID),
                        new System.Security.Claims.Claim("purpose", "pending_mfa"),
                        new System.Security.Claims.Claim("useMfaToken", useMfaToken),
                        new System.Security.Claims.Claim("email", email ?? "")
                    };

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(5),
                Issuer = DB.Url,
                Audience = DB.Url,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(SigningKeyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = handler.CreateToken(descriptor);
            return handler.WriteToken(token);
        }

        public static bool ValidatePendingMfaToken(string token, out string userID, out string useMfaToken, out string email)
        {
            userID = null; useMfaToken = null; email = null;
            if (string.IsNullOrEmpty(token)) return false;

            var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(SigningKeyBytes),
                ValidateIssuer = true,
                ValidIssuer = DB.Url,
                ValidateAudience = true,
                ValidAudience = DB.Url,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(30)
            };

            try
            {
                var principal = handler.ValidateToken(token, validationParameters, out _);
                var purpose = principal.Claims.FirstOrDefault(c => c.Type == "purpose")?.Value;
                if (purpose != "pending_mfa") return false;

                userID = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
                useMfaToken = principal.Claims.FirstOrDefault(c => c.Type == "useMfaToken")?.Value;
                email = principal.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                return !string.IsNullOrEmpty(userID);
            }
            catch
            {
                return false;
            }
        }

        // Validates signature, issuer, audience, and expiry — returns "0" for any
        // missing/forged/expired/malformed token.
        public static string ValidateAndGetUID(string token, out string csrf)
        {
            csrf = "";
            if (string.IsNullOrEmpty(token)) return "0";

            var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(SigningKeyBytes),
                ValidateIssuer = true,
                ValidIssuer = DB.Url,
                ValidateAudience = true,
                ValidAudience = DB.Url,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(30)
            };

            try
            {
                var principal = handler.ValidateToken(token, validationParameters, out _);
                var uid = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
                csrf = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value ?? "";
                return uid ?? "0";
            }
            catch
            {
                return "0";
            }
        }
    }
}
