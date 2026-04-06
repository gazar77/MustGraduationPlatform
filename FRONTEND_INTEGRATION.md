# Frontend integration — status (Angular ↔ .NET API)

**Detailed changelog (features, routes, services):** [docs/FRONTEND_CHANGES.md](docs/FRONTEND_CHANGES.md)

**API base:** `environment.apiUrl` (e.g. `https://…/api/v1`). Backend uses JWT in HttpOnly cookie `access_token`.

---

## Implemented

| Area | Notes |
|------|--------|
| **Auth** | `POST /auth/identify`, login flows, `GET /auth/me`, `User` mapping. |
| **Admin CMS** | `getAllForManage()` for news/events/templates/ideas; admin-management CRUD. |
| **Idea detail** | `GET /ideas/:id` via `IdeaService.getIdeaById` with loading/error UI. |
| **Student idea submit** | `POST /ideas/student-submit` (Student/Admin); idea-register requires login as Student/Admin. |
| **Admin users** | `GET /api/v1/users` (Admin); [`user-list`](src/app/features/admin/user-list/) + [`UsersService`](src/app/core/services/users.service.ts). |
| **Admin site settings** | `GET /api/v1/site-settings` + `PUT …/{key}`; [`/admin/settings`](src/app/features/admin/admin-settings/) + `SiteSettingsService.getAll` / `upsert`. |
| **Admin proposal add** | New submission via `POST /project-submissions` with `type: 'proposal'` (modal fields for add). |
| **Dashboard activities** | GET + POST audit from admin-management. |
| **Site settings (read)** | `parseStoredValue` for proposal deadline / academic year. |
| **File uploads (wwwroot)** | `POST /api/v1/project-submissions/with-file` saves files under `wwwroot/uploads` and returns `fileUrl` like `/uploads/...`. For links from the SPA on another host, prefix with the API origin (no `/api/v1`). |

---

## Deferred (larger product work)

| Item | Notes |
|------|--------|
| **Mega menu & i18n** | Static [`navigation.data.ts`](src/app/core/data/navigation.data.ts) / `language.service` — optional CMS. |
| **Other media** | Event images / template files can later use the same file storage pattern + URL fields. |

**Faculty / supervisor UI** (`/doctor`): same **`Admin`** role as the admin panel; `GET /api/v1/doctor/dashboard` and `GET /api/v1/ideas/for-me` require **`Admin`**. Faculty signs in with the admin login flow.

---

## Backend reference

- **Users (Admin):** `GET /api/v1/users`
- **Site settings (Admin):** `GET /api/v1/site-settings`, `PUT /api/v1/site-settings/{key}` with `{ "value": "..." }`
- **Student ideas:** `POST /api/v1/ideas/student-submit`
- **Current user:** `GET /api/v1/auth/me`
- **Swagger:** `/swagger` (dev)
- **Health:** `GET /health`, `/health/live`, `/health/ready`
- **CORS:** `Cors:AllowedOrigins` + credentials for cookies
- **Publish:** `backend/publish-for-monsterasp.bat` / `.ps1`
- **SQL seed:** `backend/sql/seed-online-database.sql`
- **Multipart uploads:** `POST /api/v1/project-submissions/with-file` (files on disk under `wwwroot/uploads`)
