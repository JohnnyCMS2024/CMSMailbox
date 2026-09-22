using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace CMSMailbox
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Same precedence chain as CMS\csFileARchive\Program.cs: appsettings.json
            // (optional, gitignored, no real secrets) -> user-secrets (local dev) ->
            // environment variables (Azure App Service Application Settings win).
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), optional: true)
                .AddEnvironmentVariables()
                .Build();

            DB.ConnectionString = config["AppSettings:ConnectionString"];
            DB.Url = config["AppSettings:Url"];
            DB.Environment = config["AppSettings:Environment"];
            DB.JWT_Key = config["AppSettings:JwtSigningKey"];
            DB.GmfaKey = config["AppSettings:GmfaKey"]; // must match the corresponding CMS environment's value
            DB.CmsUrl = config["AppSettings:CmsUrl"];

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
