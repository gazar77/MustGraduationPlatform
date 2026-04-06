# MUST Graduation Platform — ASP.NET Core API

## EF Core CLI tools

**Version mismatch warning:** If you see *Entity Framework tools version '8.0.0' is older than runtime '8.0.11'*, either update the global tool (`dotnet tool update --global dotnet-ef`) or use the **repo-local** tool (pinned to 8.0.11):

```bash
cd backend
dotnet tool restore
dotnet tool run dotnet-ef -- migrations list --project MustGraduationPlatform.Infrastructure --startup-project MustGraduationPlatform.Api
```

**Design-time DbContext:** `MustGraduationPlatform.Infrastructure/Persistence/AppDbContextFactory.cs` implements `IDesignTimeDbContextFactory<AppDbContext>` so `dotnet ef` can build the context without the web app’s DI. It loads connection strings from `MustGraduationPlatform.Api/appsettings.json` (and walks up folders so it works from the repo root or `backend/`).

If you still see *Unable to resolve service for type ... DbContextOptions*, run EF commands from the **`backend`** directory (or ensure `backend/MustGraduationPlatform.Api/appsettings.json` exists on disk).

## Run locally

1. Install [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
2. Ensure SQL Server LocalDB is available (default connection string in `MustGraduationPlatform.Api/appsettings.json`), or change `ConnectionStrings:DefaultConnection` to your SQL Server instance.
3. From the `backend` folder:

```bash
dotnet restore
dotnet ef database update --project MustGraduationPlatform.Infrastructure --startup-project MustGraduationPlatform.Api
dotnet run --project MustGraduationPlatform.Api
```

4. Open `https://localhost:7003/swagger` (see `launchSettings.json` for ports).

### SQL Server: transient retries vs. real connection failures

EF Core is configured with **`EnableRetryOnFailure`** (see `Persistence/SqlServerRetryConfiguration.cs`) so short, transient SQL errors can be retried automatically.

If you see **Win32Exception (64)** or *server was not found / not accessible*, the database endpoint is still unreachable (wrong host, firewall, VPN, or SQL not allowing remote connections). **Retries will not fix that**—correct the connection string and network path first.

## Health checks (no auth)

Use these before wiring the Angular app to confirm the API and database are reachable:

| URL | Purpose |
|-----|---------|
| `GET /health` | Full report (JSON): `self` + `database` checks |
| `GET /health/live` | Liveness: process is running (`self` only) |
| `GET /health/ready` | Readiness: SQL Server via EF Core (`database`) |

Example: `curl -k https://localhost:7003/health`

Expect HTTP **200** when healthy; **503** if a check fails (e.g. DB down).

On startup, the database is migrated and **seed data** is applied (if empty). Test accounts:

| Email | Role | Password (change in production) |
|-------|------|----------------------------------|
| `admin@must.edu.eg` | Admin (includes faculty; use `/doctor` for supervisor-focused views) | `MustAdminTest#2026` |
| `student@must.edu.eg` | Student | `MustStudentTest#2026` |

These values are defined in `MustGraduationPlatform.Infrastructure/Persistence/DataSeeder.cs`.

## Configuration

- **JWT** — `Jwt` section: `SigningKey` must be long enough for HS256 (use a strong secret in production via environment variables).
- **SMTP** — `Smtp` section for student OTP emails. If `Host` is empty, emails are logged to the console instead (development).
- **CORS** — `Cors:AllowedOrigins` must include your Angular SPA origin.
- **File uploads (local disk)** — `POST /api/v1/project-submissions/with-file` saves files under **`wwwroot/uploads`** on the API host. `UseStaticFiles()` serves them at **`/uploads/...`**. The stored `fileUrl` is a path like `/uploads/...`; when the Angular app runs on another origin (e.g. Vercel), build the browser URL as **API public origin** + `fileUrl` (same host as the API, without `/api/v1`). Ensure the deploy folder includes **`wwwroot`** so uploads persist next to the app.

## MonsterASP.net deployment

1. Create an **ASP.NET Core** site and an **MSSQL** database in the hosting control panel.
2. Set the connection string in **environment variables** (recommended):  
   `ConnectionStrings__DefaultConnection=<your panel connection string>`  
   See [MonsterASP environment variables](https://help.monsterasp.net/books/development/page/environment-variables-as-configuration-store).
3. Set **`Jwt__SigningKey`** to a strong random string (do not commit to source control).
4. Set **`Jwt__Issuer`** / **`Jwt__Audience`** if you override defaults.
5. Set **`Cors__AllowedOrigins__0`** (and `__1`, etc.) to your Angular production URL(s).
6. Student file uploads write to **`wwwroot/uploads`** on the server; keep that folder writable and included in deployments so files are not lost on publish.
7. Configure **SMTP** in the panel or via env vars (`Smtp__Host`, `Smtp__User`, `Smtp__Password`, `Smtp__From`) for student activation emails.
8. **One-click publish folder (FTP / manual upload):** from the `backend` folder run **`publish-for-monsterasp.bat`** (double-click) or **`publish-for-monsterasp.ps1`**. Each run **deletes** the previous `backend/publish` folder, then builds **Release** framework-dependent output there. Upload that folder’s contents to MonsterASP (or zip and deploy).  
   Alternatively use **Web Deploy** from Visual Studio with a `.publishSettings` profile from the panel.
9. After deployment, run **`dotnet ef database update`** against the hosted database (from a machine that can reach the server), or run migrations as part of your pipeline.

Use HTTPS in production so `Secure` cookies work for authentication.

## Solution layout

- `MustGraduationPlatform.Domain` — entities and enums  
- `MustGraduationPlatform.Application` — DTOs, service interfaces, validators  
- `MustGraduationPlatform.Infrastructure` — EF Core, Identity, email, JWT, service implementations  
- `MustGraduationPlatform.Api` — controllers, middleware, `Program.cs`  

See the repository root `FRONTEND_INTEGRATION.md` for Angular-specific changes.

## SQL seed for hosted database

After migrations are applied on MonsterASP (or any SQL Server), you can run **[sql/seed-online-database.sql](sql/seed-online-database.sql)** in SSMS / Azure Data Studio against your **application** database. It adds the same test accounts and sample rows as `DataSeeder` (departments, site settings, idea, news, event, template, activity). It is written to be **safe to run once** (skips users if emails already exist).

To regenerate password hashes if you change the default passwords, run `backend/scripts/GeneratePasswordHashes` and replace the hash constants in the SQL file.
