# Frontend changes documentation

This document describes Angular changes made to integrate the SPA with the .NET API: **local file storage** (`wwwroot/uploads`), **graduation flows**, **faculty (“doctor”) dashboard**, **templates with file upload**, and **auth/role behavior**.

**API base:** `environment.apiUrl` (e.g. `https://<host>/api/v1`). The API issues JWT in an HttpOnly cookie `access_token`; `HttpClient` calls use `withCredentials` where configured so cookies are sent.

---

## 1. Environment

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Development `apiUrl` |
| `src/environments/environment.prod.ts` | Production `apiUrl` |

Both expose `apiUrl` ending in `/api/v1`. Static files (uploads) are served from the **same host** at paths like `/uploads/...`, **without** `/api/v1`.

---

## 2. Utilities (`src/app/core/utils/`)

### `api-url.util.ts`

- **`apiPublicOrigin()`** — Strips `/api/v1` from `environment.apiUrl` so you get the API host origin used for static files.
- **`fileUrlToAbsolute(fileUrl)`** — Turns a stored path such as `/uploads/...` into a full `https://...` URL for `<a href>`, `<img src>`, or opening uploads when the SPA is hosted on a different origin (e.g. Vercel) than the API.

**Used by:** `template-list` (download links), `graduation/requirements` (last uploaded file link).

---

## 3. New services

### `GraduationService` (`src/app/core/services/graduation.service.ts`)

| Method | HTTP | Audience |
|--------|------|----------|
| `getMyProject()` | `GET /graduation/my-project` | Student |
| `getMyRequirementFiles()` | `GET /graduation/requirements/my` | Student |
| `uploadRequirement(key, file)` | `POST /graduation/requirements/upload` (multipart) | Student |

Types: `GraduationProject`, `GraduationTeamMember`, `GraduationRequirementFile` (aligned with API JSON camelCase).

### `DoctorDashboardService` (`src/app/core/services/doctor-dashboard.service.ts`)

| Method | HTTP | Audience |
|--------|------|----------|
| `getDashboard()` | `GET /doctor/dashboard` | Admin (faculty) |

Response shape: `DoctorDashboard` — `supervisedIdeasCount`, `pendingProposalsCount`, `ideas` (same shape as `Idea[]` from API).

---

## 4. Updated services

### `AuthService` (`src/app/core/services/auth.service.ts`)

- **`User` mapping** — Only **`Student`** and **`Admin`** roles (no separate “Doctor” role in the UI).
- Faculty uses the **same admin login** as other staff; **`doctorLogin`** was removed when the backend dropped `POST /auth/doctor/login`.
- **`mapUser`** sets `role` to `'Admin'` or `'Student'` from `GET /auth/me`.

### `IdeaService` (`src/app/core/services/idea.service.ts`)

- **`getIdeasForMe()`** — `GET /ideas/for-me` — lists ideas where the API matches the current user’s display name to `SupervisorName`. Requires **Admin** cookie (faculty/staff).

### `TemplateService` (`src/app/core/services/template.service.ts`)

- **`addTemplateWithFile(file, meta)`** — `POST /templates/with-file` (multipart) so new templates store a real **`fileUrl`** on the server instead of `#`.

### `ProjectSubmissionService` / submission forms

- Comments and user-facing errors refer to **wwwroot/uploads** and API checks instead of Azure Blob Storage.
- Affected areas: `project-registration`, `proposal-form` (upload failure messages), `project-submission.model.ts` (comment on `fileUrl`).

---

## 5. Models

### `User` (`src/app/core/models/user.model.ts`)

```ts
role: 'Student' | 'Admin';
```

There is **no** `'Doctor'` role in the client; faculty features rely on **`Admin`**.

### `ProjectSubmission` (`src/app/core/models/project-submission.model.ts`)

- `fileUrl` documented as a path under the API host; clients on another origin should prefix with the API public origin (see `fileUrlToAbsolute`).

---

## 6. Routing & guards

### `app-routing.module.ts`

| Path | Lazy module | Guard | `data.roles` |
|------|-------------|-------|----------------|
| `doctor` | `DoctorModule` | `AuthGuard` | `['Admin']` |

Faculty/supervisor UI is **`/doctor`**, authorized as **Admin** (same role as `/admin`).

### `graduation-routing.module.ts`

All child routes use **`AuthGuard`** with **`data: { roles: ['Student'] }`**:

| Path | Component | Notes |
|------|-----------|--------|
| `''` | `GraduationFormComponent` | Loads printable form data from API |
| `proposal` | `ProposalSubmissionComponent` | CTA to `/submission` |
| `requirements-1` | `GraduationRequirementsComponent` | `data.number: '1'` |
| `requirements-2` | `GraduationRequirementsComponent` | `data.number: '2'` |

Parent URL: **`/graduation-form`** (see `app-routing`).

### `doctor-routing.module.ts`

| Path | Component |
|------|-----------|
| `''` | `DoctorDashboardComponent` |
| `ideas/new` | `IdeaManagementComponent` (create) |
| `ideas/edit/:id` | `IdeaManagementComponent` (edit) |

---

## 7. Feature components

### Graduation — `graduation-form`

- Loads **`GraduationService.getMyProject()`** on init.
- **Loading** and **error** states (e.g. 404 when no proposal/submission matches the student).
- Replaces hardcoded `projectInfo` with API-driven title, department, supervisor, and team rows.

### Graduation — `requirements`

- Loads previous upload for the current requirement key via **`getMyRequirementFiles()`**.
- **Submit** sends **`uploadRequirement(requirementKey, file)`** via multipart form.
- Success/error messages; link to last file uses **`fileUrlToAbsolute`**.

### Graduation — `proposal-submission`

- No longer a fake form; shows a short explanation and **`routerLink` to `/submission`** for the real proposal upload flow.

### Doctor — `doctor-dashboard`

- Calls **`DoctorDashboardService.getDashboard()`**.
- Shows counts and a table of ideas with links to **`/doctor/ideas/edit/:id`** and **new idea** at **`/doctor/ideas/new`**.

### Doctor — `idea-management`

- Create/edit forms call **`IdeaService.addIdea`** / **`updateIdea`** with payloads matching the API (admin-only endpoints on the server).

### Templates — `template-list`

- **`absFileUrl()`** wraps **`fileUrlToAbsolute`** for the download button so `#` or relative `/uploads/...` work when the SPA and API hosts differ.
- Optional **add-with-file** flow (programmatic file picker + **`addTemplateWithFile`**) when extending the UI from prompts (if wired in the template).

### Auth — `login`

- **Identify** → **Admin** → password step → **`/admin`**.
- **Identify** → **Student** → OTP flow → **`/dashboard`**.
- No separate doctor login step.

### Shell — `header`

- For **`user.role === 'Admin'`**, shows a compact link to **`/doctor`** (faculty / supervisor dashboard), in addition to normal navigation.

---

## 8. Files touched (reference)

| Area | Paths (representative) |
|------|-------------------------|
| Core utils | `src/app/core/utils/api-url.util.ts` |
| Core services | `graduation.service.ts`, `doctor-dashboard.service.ts`, `auth.service.ts`, `idea.service.ts`, `template.service.ts` |
| Models | `user.model.ts`, `project-submission.model.ts` |
| App routing | `src/app/app-routing.module.ts` |
| Graduation | `features/graduation/**/*` |
| Doctor | `features/doctor/**/*` |
| Auth | `features/auth/login/*` |
| Templates | `features/templates/template-list/*` |
| Submission | `features/submission/project-registration/*`, `proposal-form/*` |
| Layout | `shared/components/header/header.component.html` |

---

## 9. Related backend behavior (for testers)

- **Uploads:** API stores files under **`wwwroot/uploads`**; URLs returned as **`/uploads/...`**. The API must enable static files for those paths.
- **CORS:** `Cors:AllowedOrigins` must include the SPA origin; cookies require **`AllowCredentials`** alignment with the API host.
- **Faculty:** **`/doctor`** and **`/api/v1/doctor/*`** use the **Admin** role, not a separate Doctor role.

---

## 10. See also

- [`FRONTEND_INTEGRATION.md`](../FRONTEND_INTEGRATION.md) — high-level integration status and endpoint list.
- [`backend/README.md`](../backend/README.md) — API run, test accounts, deployment.
