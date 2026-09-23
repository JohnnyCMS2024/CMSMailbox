using System.Net.Http;
using System.Security.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CMSMailbox
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // Used only by IaViewerController to proxy GetIAPDF/DownloadIA byte-serving
            // requests through to CMSNEO itself — see DB.CmsUrl.
            services.AddHttpClient();

            // Named client, forced to TLS 1.2: .NET 9's HttpClient defaults to
            // negotiating TLS 1.3 first, which some corporate on-path TLS-inspection
            // proxies mishandle even though browsers (which fall back more
            // gracefully) connect to the same host fine — surfaced locally as
            // AuthenticationException: "remote party sent a TLS alert:
            // 'ProtocolVersion'" calling CMSNEO's own domain. Only affects this local
            // dev environment's outbound path; use "CmsProxy" from
            // IaViewerController instead of the default client for that reason.
            services.AddHttpClient("CmsProxy")
                .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                {
                    SslProtocols = SslProtocols.Tls12
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseHttpsRedirection();
            app.UseDefaultFiles(); // serves wwwroot/index.html for "/" — must precede UseStaticFiles

            // wwwroot's HTML/JS/CSS (index.html, ia-viewer.html, the ported IA-viewer
            // scripts) have no cache-busting query strings — asp-append-version is a
            // Razor tag helper and does nothing on these plain static files. Without
            // this, browsers can keep serving an old cached copy for a long time after
            // a fresh deploy, which looks identical to a failed/stale deploy from the
            // outside. Force revalidation on every request instead.
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers["Cache-Control"] = "no-cache, must-revalidate";
                }
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
