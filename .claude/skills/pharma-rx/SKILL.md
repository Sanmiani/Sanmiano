---
name: pharma-rx
description: Use when starting any task on the Pharmacy Prescription Manager project — loads project context, tech stack, data model, PHIPA constraints, and file structure conventions before any work begins
---

# Pharmacy Prescription Manager — Project Context

## What this project is

A multi-branch, staff-facing web app for Ontario-based pharmacies. Staff manage client prescription records. A daily cron job emails clients when their supply is 7 or fewer days from running out. Full PRD lives at `projects/pharma-rx-manager/PRD.md`.

## PHIPA constraints (non-negotiable)

- All data — including health fields (conditions, allergies, prescriptions) — must stay on Canadian servers. Host: **DigitalOcean Toronto (`tor1`)**.
- PHI must never appear in application logs, error messages sent to external services, or URL query parameters.
- Every read/write of sensitive fields (conditions, allergies) must produce an `audit_logs` entry.
- Clients must have `email_consent = true` before any email is sent.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Email | Resend SDK |
| Job scheduler | `node-cron` (daily 8 AM) |
| Auth | JWT (access + refresh tokens) |
| State (frontend) | Zustand |

## Monorepo structure

```
pharma-rx-manager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/env.ts
│       ├── lib/
│       │   ├── prisma.ts       ← Prisma client singleton
│       │   └── email.ts        ← Resend wrapper
│       ├── middleware/
│       │   ├── auth.ts         ← JWT verification
│       │   ├── rbac.ts         ← Role guard factory
│       │   └── audit.ts        ← Audit log writer
│       ├── modules/
│       │   ├── auth/
│       │   ├── branches/
│       │   ├── clients/
│       │   ├── prescriptions/
│       │   ├── reminders/
│       │   └── users/
│       └── jobs/
│           └── reminder.job.ts ← node-cron daily run
├── frontend/
│   └── src/
│       ├── api/                ← Typed Axios wrappers per module
│       ├── components/         ← Shared UI (Button, Table, Modal, etc.)
│       ├── pages/              ← Route-level pages
│       ├── hooks/              ← React Query hooks per resource
│       ├── stores/             ← Zustand stores
│       └── types/              ← Shared TS types
└── projects/pharma-rx-manager/PRD.md
```

## Module pattern (backend)

Each module under `src/modules/<name>/` has exactly three files:

```
<name>.routes.ts      ← Express Router, applies middleware, calls controller
<name>.controller.ts  ← Parses req, calls service, returns res
<name>.service.ts     ← All business logic and Prisma queries
```

Never put Prisma queries in controllers. Never put request/response logic in services.

## Auth & RBAC

Three roles: `super_admin`, `branch_admin`, `staff`.

```typescript
// Protect a route:
router.get('/', authenticate, requireRole(['branch_admin', 'super_admin']), controller.list)
```

`authenticate` middleware attaches `req.user = { id, role, branchId }`.

Branch scoping rule: unless role is `super_admin`, every Prisma query that touches client or prescription data **must** include `where: { branchId: req.user.branchId }`.

## Data model reference

See `references/data-model.md` in this skill for the full Prisma schema.

## Conventions

See `references/conventions.md` in this skill for naming, error handling, and API response shape.
