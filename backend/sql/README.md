# SQL scripts

| File | Purpose |
|------|---------|
| `seed-online-database.sql` | Run **after** EF migrations on your hosted SQL Server. Seeds departments, test users (`admin@must.edu.eg`, `student@must.edu.eg`), site settings, and the same sample CMS rows as the app `DataSeeder`. |

Default passwords are documented in the script header. Regenerate `PasswordHash` values with `dotnet run` from `../scripts/GeneratePasswordHashes` if you change them.
