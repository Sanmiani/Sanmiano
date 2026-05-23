---
name: pharma-rx-feature
description: Use when building any new feature for the Pharmacy Prescription Manager — backend route, frontend page, or both — enforces module pattern, branch scoping, PHIPA audit rules, and test coverage before marking complete
---

# Pharma RX — Feature Build Workflow

## Before starting

Load `pharma-rx` for project context, data model, and conventions if not already in context. Read the relevant PRD section at `projects/pharma-rx-manager/PRD.md`.

## Step 1 — Scope the feature

Answer these before writing any code:

1. Which data model(s) does this touch?
2. Does it involve PHI fields (`conditions`, `allergies`, any `Prescription` field)? If yes, audit logging is required.
3. Which roles can access it? What branch-scoping applies?
4. Is this backend only, frontend only, or full-stack?

State the answers in a one-sentence plan before proceeding.

## Step 2 — Backend (always before frontend)

### 2a. Schema change (if needed)
- Edit `backend/prisma/schema.prisma`
- Run `npx prisma migrate dev --name <descriptive-name>`
- Never edit migration files by hand after they are created

### 2b. Service
- Create or edit `backend/src/modules/<name>/<name>.service.ts`
- All Prisma queries live here
- Apply branch scoping: `actor.role === 'super_admin' ? {} : { branchId: actor.branchId }`
- Call `auditLog()` for any PHI read or write
- Throw `AppError` for business rule violations, never `res.status()` from a service

### 2c. Controller
- Create or edit `backend/src/modules/<name>/<name>.controller.ts`
- Parse and validate request (use `zod` for body validation)
- Call service, return `{ success: true, data }` envelope
- Do not put business logic here

### 2d. Routes
- Create or edit `backend/src/modules/<name>/<name>.routes.ts`
- Apply `authenticate` middleware to every route
- Apply `requireRole([...])` for role restrictions
- Register the router in `backend/src/app.ts`

### 2e. Test the route
- Use a REST client (Thunder Client / Postman) or write an integration test
- Test: authenticated access works, unauthenticated returns 401, wrong-branch access returns 403 or empty result, PHI access creates audit log entry

## Step 3 — Frontend (if needed)

### 3a. Type
- Add or update the shared TypeScript type in `frontend/src/types/`
- Match Prisma model field names exactly

### 3b. API layer
- Add or update `frontend/src/api/<module>.ts`
- Typed Axios wrapper returning the inner `data` from the response envelope

### 3c. React Query hook
- Add or update `frontend/src/hooks/use<Resource>.ts`
- `useQuery` for reads, `useMutation` + `invalidateQueries` for writes

### 3d. Page / Component
- Route-level page in `frontend/src/pages/<module>/`
- Shared UI in `frontend/src/components/`
- Use Tailwind utility classes only — no inline `style` props
- Show loading and error states for every query

### 3e. Route registration
- Add the page to the React Router config
- Apply route guard for the required roles

## Step 4 — Verification checklist

Before calling any feature done, confirm each item:

- [ ] Branch scoping applied to all Prisma queries
- [ ] PHI reads/writes produce an `AuditLog` entry
- [ ] `email_consent` checked before any email is sent
- [ ] No secrets or PHI in console.log or error strings sent to client
- [ ] Unauthenticated requests return 401
- [ ] Wrong-role requests return 403
- [ ] Loading + error states handled in the UI
- [ ] Migration runs cleanly from scratch (`npx prisma migrate reset` on dev)

## Reminder engine specifics

When working on `jobs/reminder.job.ts`:

```typescript
// Trigger condition per prescription
const threshold = prescription.reminderDaysThreshold ?? 7
const effectiveEnd = min([prescription.expectedEndDate, prescription.estimatedEndDate].filter(Boolean))
const daysLeft = differenceInDays(effectiveEnd, new Date())
const alreadySent = await hasRecentReminder(prescription.id, 48) // hours

if (daysLeft <= threshold && !alreadySent && client.emailConsent) {
  await sendReminderEmail(prescription, client, branch)
  await logReminder(prescription.id, client, 'Sent')
}
```

Never send an email before checking `emailConsent`. Log every attempt (sent or failed) to `ReminderLog`.

## Common mistakes

| Mistake | Fix |
|---|---|
| Prisma query in controller | Move to service |
| Missing branch scope | Add `branchId: actor.branchId` to `where` |
| PHI read without audit log | Call `auditLog()` in service before return |
| Frontend calling API before loading check | Guard with `isLoading` state |
| Hard-coding role strings | Use the `Role` enum from Prisma client |
