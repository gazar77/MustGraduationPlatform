# Frontend integration (Angular) — MUST Graduation Platform API

This document is for the Angular team. The backend is implemented under `backend/` and exposes versioned REST endpoints under `/api/v1`. Authentication uses **JWT in an HttpOnly cookie** named `access_token` (not `localStorage`).

## Base URL

- Development: configure your Angular `environment.apiUrl` to match the API (e.g. `https://localhost:7003`).
- Production: set to your deployed API origin (HTTPS).

**All authenticated requests** must use `credentials: 'include'` (Angular `HttpClient` with `withCredentials: true`).

## CORS

The API allows origins listed in `Cors:AllowedOrigins` in `appsettings.json`. Add your production Angular URL there on the server.

## Auth flows

1. **Identify** — `POST /api/v1/auth/identify` body `{ "email": "user@must.edu.eg" }`  
   Response: `{ "exists": true|false, "userType": "Admin" | "Student" | null }` when `exists` is true.

2. **Admin (staff)** — `POST /api/v1/auth/admin/login` body `{ "email", "password" }`  
   Sets `access_token` cookie on success.

3. **Student — send code** — `POST /api/v1/auth/student/send-code` body `{ "email" }`  
   Sends a 6-digit code by email (for login if the user exists, or for registration if the email is not yet registered).  
   Returns `204` on success.

4. **Student — login** — `POST /api/v1/auth/student/login` body `{ "email", "code", "password" }`  
   Sets `access_token` cookie.

5. **Student — register** — `POST /api/v1/auth/register` body `{ "email", "password", "fullName", "departmentId", "activationCode" }`  
   Call `send-code` first for a **new** email that does not exist yet.

6. **Logout** — `POST /api/v1/auth/logout` (clears cookie). Safe to call without auth.

### Email rules

Only addresses matching `*@must.edu.eg` are accepted.

### Roles and route guards

The API issues JWT role claims `Admin` or `Student`. The Angular app currently uses `Doctor` and `Admin` in route data (`app-routing.module.ts`). Align with the backend by either:

- Treating `Admin` as staff for both `/admin` and `/doctor`, or  
- Mapping backend `Admin` to both `Doctor` and `Admin` in the guard.

## Replace mock services

Point these services at the API instead of in-memory arrays:

- `auth-mock.service.ts` → real HTTP auth flow  
- `idea.service.ts` → `/api/v1/ideas` (see Swagger for manage routes)  
- `news.service.ts`, `event.service.ts`, `template.service.ts`  
- `proposal.service.ts`, `project-submission.service.ts`  
- `contact.service.ts`, `dashboard.service.ts`  

Remove `localStorage` keys `must_user` and `must_token` for authentication.

## Other UI fixes

- **Header logout** (`header.component.ts`) navigates to `/login`; the app route is `/auth/login` — update the path.  
- **Departments** — load from `GET /api/v1/departments` instead of hardcoded `<option>` values in register.  
- **Graduation form** — load `projectInfo` from a future API when available.  
- **Proposal deadline / academic year** — read from `GET /api/v1/site-settings/{key}` (e.g. `proposalDeadline`, `academicYearLabel`).  
- **Theme / language** (`localStorage`) can remain; they are unrelated to JWT.

## Swagger

Open `/swagger` in Development on the API to inspect all endpoints and schemas.

## Health checks (verify backend before integration)

Public endpoints (no cookie):

- `GET /health` — JSON summary of all checks (app + database)
- `GET /health/live` — liveness (`self`)
- `GET /health/ready` — readiness (SQL Server connection via EF Core)

Use these to confirm the API and database are healthy before changing the Angular app.
