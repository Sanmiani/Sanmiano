# Development Plan — Pharmacy Prescription Manager

**Version:** 1.0 | **Date:** 2026-05-10 | **Status:** Ready to Build  
Skills: `/pharma-rx` (context) · `/pharma-rx-feature` (build) · `/pharma-rx-deploy` (ship)

---

## Stages Overview

| # | Stage | Phase | Dependencies |
|---|---|---|---|
| 0 | Project Foundation | MVP | — |
| 1 | Authentication | MVP | 0 |
| 2 | Organization & Branch Management | MVP | 1 |
| 3 | Staff / User Management | MVP | 2 |
| 4 | Client Management | MVP | 3 |
| 5 | Prescription Management | MVP | 4 |
| 6 | Reminder Engine | MVP | 5 |
| 7 | Dashboards | Operations | 6 |
| 8 | Compliance Features | Operations | 4, 5 |
| 9 | Polish & Reporting | Polish | 7, 8 |
| 10 | Production Deployment | Deploy | 9 |

---

## Stage 0 — Project Foundation

**Goal:** Working monorepo with database connection, health check, and dev tooling. Nothing user-facing yet.

### Backend tasks
- [ ] Init Node.js + TypeScript project (`backend/`)
- [ ] Install: `express`, `prisma`, `@prisma/client`, `bcrypt`, `jsonwebtoken`, `zod`, `node-cron`, `resend`, `date-fns`
- [ ] Install dev: `typescript`, `ts-node`, `nodemon`, `eslint`, `prettier`
- [ ] Configure `tsconfig.json` (strict mode, paths)
- [ ] Write `config/env.ts` — Zod parse of `process.env`, fail fast on missing vars
- [ ] Write `lib/prisma.ts` — singleton Prisma client
- [ ] Write initial `prisma/schema.prisma` — full schema from `/pharma-rx` data model reference
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Write `app.ts` — Express app with global error handler and JSON middleware
- [ ] Write `server.ts` — starts HTTP server
- [ ] Add `GET /health` endpoint → `{ status: "ok", db: "connected" }`

### Frontend tasks
- [ ] Init React + TypeScript project (`frontend/`) via Vite
- [ ] Install: `tailwindcss`, `axios`, `react-router-dom`, `@tanstack/react-query`, `zustand`
- [ ] Configure Tailwind (`tailwind.config.ts`, `postcss.config.js`)
- [ ] Set up React Router with a root layout
- [ ] Create `api/index.ts` — Axios instance with base URL + auth token interceptor

### Acceptance criteria
- `GET /health` returns 200 with DB connected
- `npx prisma migrate reset` runs cleanly from scratch
- Frontend dev server starts with no errors
- ESLint and Prettier configured and passing

---

## Stage 1 — Authentication

**Goal:** Staff can log in, receive JWT tokens, and be identified on every request. Role is embedded in the token.

### Backend tasks
- [ ] `modules/auth/auth.service.ts`
  - `register(dto)` — hash password, create user, return tokens
  - `login(dto)` — verify credentials, return access + refresh tokens
  - `refreshTokens(refreshToken)` — validate, issue new pair
  - `resetPasswordRequest(email)` — send reset link via Resend
  - `resetPassword(token, newPassword)` — verify token, update hash
- [ ] `modules/auth/auth.controller.ts` — POST /register, /login, /refresh, /reset-request, /reset
- [ ] `modules/auth/auth.routes.ts` — no auth middleware (public routes)
- [ ] `middleware/auth.ts` — verify JWT, attach `req.user = { id, role, branchId, organizationId }`
- [ ] `middleware/rbac.ts` — `requireRole(roles[])` factory function
- [ ] Rate limit `/auth/login` — max 10 attempts per 15 min per IP
- [ ] Register auth router in `app.ts` at `/api/auth`

### Frontend tasks
- [ ] `stores/authStore.ts` — Zustand store: `user`, `accessToken`, `login()`, `logout()`, `refreshTokens()`
- [ ] `pages/auth/LoginPage.tsx` — email + password form, calls login, redirects to dashboard
- [ ] `pages/auth/ResetRequestPage.tsx` — enter email, trigger reset link
- [ ] `pages/auth/ResetPasswordPage.tsx` — new password form with token from URL
- [ ] Route guard component — redirect to `/login` if no token
- [ ] Axios interceptor — attach `Authorization: Bearer <token>` to every request
- [ ] Axios interceptor — on 401, attempt token refresh; if refresh fails, logout

### Acceptance criteria
- Login returns access + refresh tokens
- Wrong credentials return 401 with `UNAUTHORIZED` code
- Authenticated request attaches user to `req.user`
- Wrong-role request returns 403 with `FORBIDDEN` code
- Rate limiter blocks after 10 failed logins
- Login page renders, submits, and redirects correctly

---

## Stage 2 — Organization & Branch Management

**Goal:** Super admin can create and manage branches. Each branch is an isolated unit.

### Backend tasks
- [ ] `modules/branches/branches.service.ts`
  - `list(actor)` — all branches if super_admin, own branch if not
  - `getById(id, actor)`
  - `create(dto, actor)` — super_admin only
  - `update(id, dto, actor)` — super_admin only
  - `deactivate(id, actor)` — soft disable; blocks staff login for that branch
- [ ] `modules/branches/branches.controller.ts` + `branches.routes.ts`
- [ ] Register at `/api/branches`

### Frontend tasks
- [ ] `pages/branches/BranchListPage.tsx` — table of all branches (super_admin only)
- [ ] `pages/branches/BranchFormPage.tsx` — create / edit form
- [ ] Navigation: super_admin sees "Branches" in sidebar; others do not

### Acceptance criteria
- Super admin can create a branch and see it in the list
- Non-super-admin cannot access branch management endpoints (403)
- Deactivated branch prevents its staff from logging in

---

## Stage 3 — Staff / User Management

**Goal:** Branch admins and super admins can manage staff accounts.

### Backend tasks
- [ ] `modules/users/users.service.ts`
  - `list(actor)` — scoped to branch unless super_admin
  - `getById(id, actor)`
  - `create(dto, actor)` — branch_admin creates staff for own branch; super_admin for any
  - `update(id, dto, actor)` — update name, role, active status
  - `deactivate(id, actor)`
- [ ] `modules/users/users.controller.ts` + `users.routes.ts`
- [ ] Register at `/api/users`

### Frontend tasks
- [ ] `pages/users/StaffListPage.tsx` — table of staff for current branch
- [ ] `pages/users/StaffFormPage.tsx` — create / edit form (name, email, role)
- [ ] Display logged-in user's name + role in the nav header
- [ ] Profile page: change own password

### Acceptance criteria
- Branch admin can create a staff user scoped to their branch
- Branch admin cannot create users for other branches (403)
- Super admin can view and manage staff across all branches

---

## Stage 4 — Client Management

**Goal:** Staff can create, search, view, update, and soft-delete client records. Consent is tracked.

### Backend tasks
- [ ] `modules/clients/clients.service.ts`
  - `list(actor, query)` — paginated, searchable by name/email/DOB, branch-scoped
  - `getById(id, actor)` — includes audit log for VIEW_SENSITIVE if conditions/allergies returned
  - `create(dto, actor)` — records `createdBy`, sets `consentDate` if consent given
  - `update(id, dto, actor)` — audit log on PHI field changes
  - `softDelete(id, actor)` — sets `isDeleted = true`, `deletedAt = now()`
  - `exportCsv(id, actor)` — returns client + prescription data as CSV string
- [ ] `middleware/audit.ts` — `auditLog()` helper
- [ ] `modules/clients/clients.controller.ts` + `clients.routes.ts`
- [ ] Register at `/api/clients`

### Frontend tasks
- [ ] `pages/clients/ClientListPage.tsx` — searchable, paginated table
- [ ] `pages/clients/ClientProfilePage.tsx` — all fields, prescription list, reminder history
- [ ] `pages/clients/ClientFormPage.tsx` — create / edit (all fields + consent toggle)
- [ ] Consent toggle: shows confirmation dialog; records date on enable
- [ ] `hooks/useClients.ts` — list, getById, create, update, delete hooks

### Acceptance criteria
- Staff can create a client and immediately search for them
- Viewing a client with PHI fields creates an AuditLog entry
- Consent toggle records `consentDate`
- Soft-deleted clients do not appear in search results
- Branch-scoping: staff cannot fetch clients from another branch

---

## Stage 5 — Prescription Management

**Goal:** Staff can record prescriptions, auto-calculate end date, and view full refill history per client.

### Backend tasks
- [ ] `modules/prescriptions/prescriptions.service.ts`
  - `listForClient(clientId, actor)` — all prescriptions for a client, sorted by `dispenseDate` desc
  - `getById(id, actor)` — with audit log
  - `create(dto, actor)` — computes `estimatedEndDate`; creates `RefillHistory` entry; audit log
  - `update(id, dto, actor)` — restricted fields only (status, notes, reminderDaysThreshold)
  - `cancel(id, actor)` — sets status to Cancelled
- [ ] `modules/prescriptions/prescriptions.controller.ts` + `prescriptions.routes.ts`
- [ ] Register at `/api/prescriptions`

### Frontend tasks
- [ ] `pages/prescriptions/PrescriptionFormPage.tsx` — create form; shows auto-calculated end date live as user fills in qty + daily rate
- [ ] `pages/clients/ClientProfilePage.tsx` — prescription tab with refill history timeline
- [ ] Prescription status badge (Active / Completed / Cancelled) with color
- [ ] `hooks/usePrescriptions.ts`

### Acceptance criteria
- Creating a prescription auto-calculates and stores `estimatedEndDate`
- A second prescription for the same client/medication appears as a new refill in history
- Prescription is branch-scoped (cannot be accessed from another branch)
- Audit log entry created when prescription is viewed

---

## Stage 6 — Reminder Engine

**Goal:** Daily cron job identifies at-risk prescriptions and sends email reminders. Every send is logged.

### Backend tasks
- [ ] `lib/email.ts` — Resend SDK wrapper: `sendReminderEmail(prescription, client, branch)`
- [ ] `assets/email-reminder.html` — HTML email template (pharmacy name, client name, medication, days remaining, branch phone)
- [ ] `jobs/reminder.job.ts`
  - Schedule: `node-cron` at `0 8 * * *` (8 AM daily)
  - Query all `Active` prescriptions where effective end date ≤ `reminderDaysThreshold` days away
  - Filter: `client.emailConsent = true`
  - Filter: no `ReminderLog` entry for this prescription in last 48 hours
  - Send email via `lib/email.ts`
  - Write `ReminderLog` entry (Sent or Failed)
  - Log summary to console (count sent, count failed, count skipped) — no PHI in log
- [ ] Register job in `server.ts` (start after DB is confirmed connected)
- [ ] `modules/reminders/reminders.service.ts` — `listForBranch(actor)`, `listForClient(clientId, actor)`
- [ ] `modules/reminders/reminders.routes.ts` — GET /api/reminders (branch-scoped)

### Frontend tasks
- [ ] `pages/reminders/ReminderLogPage.tsx` — table of all reminders sent by this branch; columns: client, medication, sent at, status
- [ ] Client profile: reminder history tab (reminders sent for this client)

### Acceptance criteria
- Prescription ≤ 7 days from end date triggers email to client
- `email_consent = false` client is skipped (no email, no log)
- Already-reminded prescription (within 48h) is not re-sent
- Failed sends create a `ReminderLog` with `status = Failed` + `errorMessage`
- No PHI appears in server logs

---

## Stage 7 — Dashboards

**Goal:** Branch staff see actionable today-view. Super admin sees cross-branch health at a glance.

### Backend tasks
- [ ] `modules/dashboard/dashboard.service.ts`
  - `getBranchSummary(actor)` — active clients count, active prescriptions count, expiring within 7 days list, reminders sent this week
  - `getSuperAdminSummary(actor)` — per-branch table: clients, active Rx, reminders sent this week
- [ ] `modules/dashboard/dashboard.routes.ts` — GET /api/dashboard
- [ ] Register at `/api/dashboard`

### Frontend tasks
- [ ] `pages/dashboard/BranchDashboardPage.tsx`
  - Stat cards: total clients, active prescriptions, expiring soon count
  - Action list: prescriptions expiring within 7 days (client name, medication, days left, link to profile)
  - Recent activity feed
- [ ] `pages/dashboard/SuperAdminDashboardPage.tsx`
  - Per-branch summary table
  - Org-wide stat cards
- [ ] Route `/` redirects to correct dashboard based on role

### Acceptance criteria
- Branch dashboard shows only current branch data
- Super admin dashboard aggregates all branches
- "Expiring soon" list links directly to the client profile

---

## Stage 8 — Compliance Features

**Goal:** Meet PIPEDA/PHIPA obligations: audit viewer, data export, soft delete, password reset.

### Backend tasks
- [ ] `modules/audit/audit.service.ts` — `list(actor, filters)` — paginated audit log; super_admin sees all, branch_admin sees own branch
- [ ] `modules/audit/audit.routes.ts` — GET /api/audit
- [ ] `modules/clients/clients.service.ts` — `exportCsv(clientId, actor)` (already listed in Stage 4)
- [ ] Soft delete already covered in Stage 4
- [ ] Password reset flow already covered in Stage 1

### Frontend tasks
- [ ] `pages/audit/AuditLogPage.tsx` — filterable table (user, action, resource, date range); super_admin only
- [ ] Client profile: "Export Data" button → downloads CSV
- [ ] Client profile: "Delete Client" button → confirmation dialog → soft delete

### Acceptance criteria
- Audit log shows every VIEW_SENSITIVE, CREATE, UPDATE, DELETE action
- CSV export contains client + prescription history in readable format
- Soft-deleted clients do not appear in any list or search

---

## Stage 9 — Polish & Reporting

**Goal:** Operational improvements for real-world use. No new data model changes.

### Tasks
- [ ] Multi-reminder windows: send at 7 days AND again at 3 days (add `secondReminderSent` flag or second threshold field)
- [ ] Prescription status management: "Mark as Completed" button on active prescription
- [ ] Email template: pharmacy logo placeholder + branch-level colour accent
- [ ] Basic monthly report: prescriptions dispensed, reminders sent, active clients — downloadable CSV
- [ ] Pagination on all list pages (clients, prescriptions, reminders, audit log)
- [ ] Empty states on all tables (friendly message + CTA when no data)
- [ ] Mobile-responsive layout check (Tailwind `sm:` / `md:` breakpoints)
- [ ] 404 page and error boundary

### Acceptance criteria
- Client receives two reminder emails: one at 7 days, one at 3 days
- All list pages paginate beyond 50 records
- App is usable on a tablet screen

---

## Stage 10 — Production Deployment

**Goal:** App live on DigitalOcean Toronto, PHIPA-compliant, monitored, with real data.

### Tasks
- [ ] Provision DigitalOcean Managed PostgreSQL in `tor1`
- [ ] Create App Platform app in `tor1`, connect GitHub repo to `main` branch
- [ ] Set all production environment variables in App Platform
- [ ] Set run command: `npx prisma migrate deploy && node dist/server.js`
- [ ] Run seed script to create Organization + first `super_admin`
- [ ] Sign DigitalOcean DPA
- [ ] Point domain (e.g. `app.pharmacyname.ca`) to App Platform
- [ ] Run full deploy checklist from `/pharma-rx-deploy` skill
- [ ] Set uptime alert on `/health` endpoint
- [ ] Change super_admin password from seed default
- [ ] Run smoke test (login → create branch → create client → create Rx → verify reminder)

### Acceptance criteria
- All 24 items on the deploy checklist pass
- Smoke test completes without errors
- Reminder email received in smoke test
- App accessible via custom domain over HTTPS

---

## File structure (target state after all stages)

```
projects/pharma-rx-manager/
├── PRD.md
├── DEVELOPMENT-PLAN.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   └── env.ts
│       ├── lib/
│       │   ├── prisma.ts
│       │   ├── email.ts
│       │   └── errors.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   ├── rbac.ts
│       │   └── audit.ts
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.routes.ts
│       │   │   ├── auth.controller.ts
│       │   │   └── auth.service.ts
│       │   ├── branches/
│       │   │   ├── branches.routes.ts
│       │   │   ├── branches.controller.ts
│       │   │   └── branches.service.ts
│       │   ├── users/
│       │   │   ├── users.routes.ts
│       │   │   ├── users.controller.ts
│       │   │   └── users.service.ts
│       │   ├── clients/
│       │   │   ├── clients.routes.ts
│       │   │   ├── clients.controller.ts
│       │   │   └── clients.service.ts
│       │   ├── prescriptions/
│       │   │   ├── prescriptions.routes.ts
│       │   │   ├── prescriptions.controller.ts
│       │   │   └── prescriptions.service.ts
│       │   ├── reminders/
│       │   │   ├── reminders.routes.ts
│       │   │   ├── reminders.controller.ts
│       │   │   └── reminders.service.ts
│       │   ├── dashboard/
│       │   │   ├── dashboard.routes.ts
│       │   │   ├── dashboard.controller.ts
│       │   │   └── dashboard.service.ts
│       │   └── audit/
│       │       ├── audit.routes.ts
│       │       ├── audit.controller.ts
│       │       └── audit.service.ts
│       ├── jobs/
│       │   └── reminder.job.ts
│       └── assets/
│           └── email-reminder.html
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   ├── index.ts
│       │   ├── auth.ts
│       │   ├── branches.ts
│       │   ├── clients.ts
│       │   ├── prescriptions.ts
│       │   ├── reminders.ts
│       │   └── dashboard.ts
│       ├── components/
│       │   ├── ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Card.tsx
│       │   └── layout/
│       │       ├── Sidebar.tsx
│       │       ├── Header.tsx
│       │       └── PageLayout.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useBranches.ts
│       │   ├── useClients.ts
│       │   ├── usePrescriptions.ts
│       │   ├── useReminders.ts
│       │   └── useDashboard.ts
│       ├── stores/
│       │   └── authStore.ts
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx
│       │   │   ├── ResetRequestPage.tsx
│       │   │   └── ResetPasswordPage.tsx
│       │   ├── dashboard/
│       │   │   ├── BranchDashboardPage.tsx
│       │   │   └── SuperAdminDashboardPage.tsx
│       │   ├── branches/
│       │   │   ├── BranchListPage.tsx
│       │   │   └── BranchFormPage.tsx
│       │   ├── users/
│       │   │   ├── StaffListPage.tsx
│       │   │   └── StaffFormPage.tsx
│       │   ├── clients/
│       │   │   ├── ClientListPage.tsx
│       │   │   ├── ClientProfilePage.tsx
│       │   │   └── ClientFormPage.tsx
│       │   ├── prescriptions/
│       │   │   └── PrescriptionFormPage.tsx
│       │   ├── reminders/
│       │   │   └── ReminderLogPage.tsx
│       │   └── audit/
│       │       └── AuditLogPage.tsx
│       └── types/
│           ├── auth.ts
│           ├── branch.ts
│           ├── client.ts
│           ├── prescription.ts
│           └── reminder.ts
└── .github/
    └── workflows/
        └── deploy.yml
```
