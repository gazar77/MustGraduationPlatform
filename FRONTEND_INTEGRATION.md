# Frontend integration — status (Angular ↔ .NET API)

This file tracks **what is already wired**, **what is still missing or wrong**, and **backend expectations**. It is updated from a full pass over `src/` against `backend/` (no frontend code was changed in this edit).

**API base:** `environment.apiUrl` (e.g. `https://…/api/v1`). Backend uses JWT in HttpOnly cookie `access_token`.

---

## Already done (implemented in the Angular app)

| Area | Notes |
|------|--------|
| **Base URL** | `src/environments/environment.ts` and `environment.prod.ts` expose `apiUrl` (currently pointed at a hosted API). |
| **Cookies on every request** | `AuthInterceptor` sets `withCredentials: true` on all `HttpClient` calls (`app.module.ts`). |
| **Core REST services** | These call `environment.apiUrl` + resource path: `idea`, `news`, `event`, `template`, `proposal`, `project-submissions`, `contact`, `dashboard` (GET `stats` / `activities`), `site-settings`. |
| **Auth service (HTTP)** | `auth.service.ts`: `admin/login`, `student/send-code`, `student/login`, `register`, `logout`, `getDepartments`. No `must_user` / `must_token` in `localStorage` for auth. |
| **Login UX** | Multi-step: identify → admin password **or** student OTP + password (`login.component.ts`). |
| **Register** | OTP + `getDepartments()` for department list (`register.component.ts`). |
| **Proposal deadline** | `proposal-form` uses `SiteSettingsService.getSetting('proposalDeadline')` (`site-settings.service.ts`). |
| **Header logout** | Navigates to `/auth/login` (fixed from old `/login`). |
| **Admin CMS shell** | `admin-management` uses the same services over HTTP (not in-memory mocks). |
| **Theme / language** | Still use `localStorage` (`theme`, `lang`) — intentional; unrelated to JWT. |

---

## Still to do or fix (frontend work)

### Critical — auth / session

1. **`POST /auth/identify` body**  
   Backend expects `{ "email": "…@must.edu.eg" }` (`IdentifyRequestDto`).  
   **`auth.service.ts` currently posts `{}`**, and **`login.component.ts` does not pass the email into `identify()`**. The identify step cannot work correctly until `identify` accepts `email` and sends `{ email }`.

2. **No “current user” endpoint on backend**  
   `auth.service.ts` calls **`GET /auth/profile`** in `fetchCurrentUser()`. The API **does not define** `/api/v1/auth/profile`. After login, the user object may never load unless you add a backend endpoint (e.g. `GET /api/v1/auth/me`) **or** change the client to build `User` from the login response (`AuthSuccessDto.user`) and drop `fetchCurrentUser` / profile.  
   Startup `checkAuthentication()` also calls the broken `identify()` with no email — refresh / F5 will not restore session correctly.

3. **`User` model vs API**  
   `user.model.ts` uses `id: number` and optional `department` codes. Backend `UserDto` uses **`id: Guid`**, `role`, `departmentCode` (string). Align types and mapping after profile/me is sorted out.

### Roles and guards

4. **`app-routing.module.ts`** still lists **`Doctor`** on `/doctor`. Backend JWT only has **`Admin`** and **`Student`**. Either map **`Admin` → Doctor + Admin` in the guard**, or change route `data.roles` to match API roles only.

### Admin vs public API routes

5. **List endpoints for CMS**  
   Public GETs return **filtered** lists (e.g. visible-only). Backend exposes **manage** routes for admins, e.g. `GET /api/v1/news/manage`, `GET /api/v1/ideas/manage`, …  
   **`news.service.ts` / `idea.service.ts` / …** currently use the **anonymous** list URLs. For admin screens, call the **`/manage`** URLs when the user is `Admin` (or add service methods `getAllForManage()`).

### Optional / feature gaps

6. **`DashboardService.addActivity()`**  
   Posts to `…/dashboard/activities`. The API only supports **GET** `stats` and `activities` — **no POST**. Remove or replace with a future admin API.

7. **Site setting values**  
   Stored as JSON strings (e.g. quoted ISO date). If `new Date(res.value)` misbehaves, **`JSON.parse(res.value)`** may be required depending on exact stored format.

8. **Graduation printable form**  
   `graduation-form.component.ts` still uses **hardcoded `projectInfo`**. Needs an API when the backend exposes team/project data.

9. **Mega menu & i18n**  
   `navigation.data.ts` and large inline dictionaries in `language.service.ts` remain **static**. Moving menu/copy to CMS is optional and can be phased.

10. **File uploads**  
    If submissions/templates require real files, ensure **multipart** endpoints and storage match backend (not verified here).

---

## Backend reference (no frontend changes)

- **Swagger:** `/swagger` on the API (dev).  
- **Health:** `GET /health`, `/health/live`, `/health/ready`.  
- **CORS:** `Cors:AllowedOrigins` must include the Angular origin; credentials required for cookies.  
- **Publish:** `backend/publish-for-monsterasp.bat` / `.ps1`.  
- **SQL seed:** `backend/sql/seed-online-database.sql`.

---

## Summary

Most of the **data layer** is on HTTP with **cookies** and a **multi-step login/register** flow. Remaining work is concentrated in **auth (identify payload, session/user after login, missing profile/me)**, **admin vs public API paths**, **role names (Doctor)**, and **non-API features** (graduation form data, optional CMS for menu/strings).
