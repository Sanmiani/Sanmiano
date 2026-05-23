# Product Requirements Document
## Pharmacy Prescription Manager

**Version:** 1.1  
**Date:** 2026-05-10  
**Status:** Draft — Ready for Build  
**Author:** Matt Sanmiano  

---

## 1. Overview

### 1.1 Product Summary

A multi-branch, staff-facing web application that enables pharmacies to store and manage client prescription records and automatically send email reminders to clients when their medication supply is approaching depletion.

### 1.2 Problem Statement

Pharmacies currently rely on manual follow-up or client self-awareness to manage prescription refills. Clients miss refill windows, run out of critical medication, and pharmacies lose recurring revenue. No lightweight, affordable system exists that combines prescription tracking with automated client communication at the branch level.

### 1.3 Goals

| Goal | Metric |
|---|---|
| Reduce missed refills | % of clients who refill before supply runs out |
| Reduce staff manual outreach | Time spent on reminder calls/messages per week |
| Improve client retention | Repeat client rate per branch |
| Give management visibility | Super admin can view compliance across all branches |

### 1.4 Out of Scope (v1)

- Patient-facing portal or login
- Prescription generation or doctor-facing tools
- Payment processing
- Drug interaction checker
- SMS reminders (email only in v1)
- Mobile app (web-first)
- Integration with external pharmacy software (e.g. Kroll, Fillware)

---

## 2. Users & Roles

### 2.1 User Roles

| Role | Description | Access |
|---|---|---|
| `super_admin` | Central operator (e.g. pharmacy owner or head office) | Full access across all branches |
| `branch_admin` | Manager of a single branch | Full access within their branch only |
| `staff` | Pharmacist or pharmacy tech | Create/edit clients and prescriptions within their branch |

### 2.2 User Personas

**Persona 1 — The Branch Pharmacist (Primary User)**  
- Logs in daily to add new clients and record new prescriptions after dispensing  
- Wants to quickly find a client and see their active prescription and refill history  
- Doesn't want to manually track who is running low — expects the system to handle it

**Persona 2 — The Branch Admin**  
- Reviews the branch dashboard to confirm reminders are going out  
- Manages staff accounts for their location  
- Pulls basic reports on active clients and upcoming refills

**Persona 3 — The Super Admin (Pharmacy Owner)**  
- Oversees all branches from one login  
- Wants a high-level view: total clients, reminders sent this week, branches by activity  
- Creates new branches and assigns branch admins

**Persona 4 — The Client (Email Recipient Only)**  
- Does not log in — receives automated email only  
- Must have given consent to receive email communications  
- Email tells them their prescription is running low and prompts them to call the pharmacy or visit for a refill

---

## 3. Functional Requirements

### 3.1 Authentication & Access Control

- Staff log in with email and password
- Passwords hashed with bcrypt
- JWT-based sessions (access token + refresh token)
- Each user is scoped to one branch, except `super_admin`
- Role-based access enforced on both frontend routes and backend API endpoints
- Password reset via email link

### 3.2 Branch Management

- Super admin can create, rename, and deactivate branches
- Each branch has: name, address, phone, province, email
- Branch deactivation disables logins for all staff in that branch

### 3.3 Staff Management

- Branch admin and super admin can create staff accounts
- Staff accounts have: name, email, role, assigned branch
- Branch admin can deactivate staff within their branch
- Super admin can manage staff across all branches

### 3.4 Client Management

Each client record contains:

| Field | Type | Notes |
|---|---|---|
| Full name | Text | Required |
| Email address | Text | Required — used for reminders |
| Phone number | Text | Optional |
| Date of birth | Date | Required |
| Medical conditions | Text (multi) | Optional — free text or tags |
| Known allergies | Text (multi) | Optional |
| Insurance provider | Text | Optional |
| Insurance policy number | Text | Optional |
| Email consent | Boolean | Required — must be true before any reminder is sent |
| Consent date | Timestamp | Auto-set when consent is toggled on |
| Branch | FK | Which branch this client belongs to |
| Created by | FK | Staff member who added the record |
| Created at | Timestamp | Auto |

- Staff can search clients by name, date of birth, or email
- Clients are scoped to the branch that created them
- Super admin can search across all branches

### 3.5 Prescription Management

Each prescription record contains:

| Field | Type | Notes |
|---|---|---|
| Client | FK | Link to client record |
| Branch | FK | Branch that dispensed |
| Medication name | Text | Required |
| Medication form | Enum | Tablet / Capsule / Liquid / Cream / Inhaler / Other |
| Dosage | Text | e.g. "10mg" |
| Frequency | Text | e.g. "Once daily", "Twice daily" |
| Quantity dispensed | Integer | Total units dispensed (e.g. 30 tablets) |
| Daily usage rate | Decimal | Units consumed per day (e.g. 1.0 for once daily) |
| Dispense date | Date | When this refill was dispensed |
| Expected end date | Date | Calculated or manually set |
| Reminder days threshold | Integer | Default: 7. Days before end date to trigger reminder |
| Status | Enum | Active / Completed / Cancelled |
| Notes | Text | Internal pharmacist notes |
| Created by | FK | Staff member |
| Created at | Timestamp | Auto |

**Calculated field:** `estimated_end_date = dispense_date + (quantity_dispensed / daily_usage_rate)`

If both `expected_end_date` (manual) and `estimated_end_date` (calculated) exist, trigger on whichever comes **first**.

### 3.6 Refill History

- Every time a new prescription record is created for a client on the same medication, it is appended to a refill timeline
- Staff can view the full refill history for any client from the client profile
- History shows: medication, quantity, dispense date, dispensed by, branch

### 3.7 Reminder Engine

**Trigger logic (runs daily at 8:00 AM local server time):**

```
FOR each active prescription:
  IF (days_until_end_date <= reminder_days_threshold) OR
     (estimated_days_remaining <= reminder_days_threshold):
       IF client.email_consent = true:
         IF no reminder sent in the past 48 hours for this prescription:
           Send reminder email
           Log reminder in ReminderLogs
```

**Email content:**
- Subject: `Prescription Reminder — [Medication Name]`
- Body: Personalized with client name, medication name, estimated days remaining, pharmacy name, branch phone number, and a prompt to call or visit
- Plain text + HTML versions
- Pharmacy branding (name, logo placeholder)

### 3.8 Reminder Logs

Each log entry records:

| Field | Notes |
|---|---|
| Prescription ID | Which prescription triggered this |
| Client ID | Who was emailed |
| Branch ID | Which branch sent it |
| Sent at | Timestamp |
| Email address | Address used at time of send |
| Status | Sent / Failed |
| Error message | If failed — for debugging |

- Staff can view reminder history per client
- Branch admin can view all reminders sent from their branch
- Super admin can view across all branches

### 3.9 Dashboards

**Branch dashboard (branch admin + staff):**
- Total active clients
- Active prescriptions count
- Prescriptions expiring within 7 days (action list)
- Reminders sent this week
- Recent activity feed

**Super admin dashboard:**
- Total branches
- Total clients (all branches)
- Reminders sent this week (all branches)
- Per-branch summary table: clients, active prescriptions, reminders sent

---

## 4. Non-Functional Requirements

### 4.1 Performance

- Page load: < 2 seconds for all main views on standard connection
- Email delivery: within 5 minutes of scheduled trigger time
- Search: client search returns results in < 500ms

### 4.2 Availability

- Target uptime: 99.5% (appropriate for a small-business SaaS)
- Scheduled maintenance communicated 24h in advance

### 4.3 Security

- All data in transit: HTTPS / TLS 1.2+
- All data at rest: encrypted (PostgreSQL with encrypted storage on Railway)
- Passwords: bcrypt with salt rounds ≥ 12
- No health data in URL query parameters
- Rate limiting on login endpoint (prevent brute force)
- OWASP Top 10 mitigations applied (SQL injection prevention via parameterized queries, XSS prevention via output encoding, CSRF tokens)
- Environment variables for all secrets — never committed to source control
- Audit log for all create/update/delete actions on client and prescription records

### 4.4 Privacy & Compliance (Canada)

**PIPEDA (federal):**
- Explicit, recorded consent required before storing health-related data
- Clients can request data export (admin can generate CSV of a client's records)
- Clients can request deletion — admin can soft-delete a client record
- Consent date and method recorded per client

**Provincial — Ontario (PHIPA):**
- PHIPA (Personal Health Information Protection Act) applies.
- All personal health information (PHI) — including conditions, allergies, prescriptions — must be stored and processed on servers physically located in Canada.
- **Hosting decision: DigitalOcean Toronto (`tor1`) region.** Railway does not offer a Canadian region. DigitalOcean Toronto is PHIPA-compatible, reliable, and cost-effective (~$12/month for a basic app + managed PostgreSQL).
- The application must have a signed **Data Processing Agreement (DPA)** with the hosting provider. DigitalOcean offers a standard BAA/DPA that covers Canadian privacy obligations.
- PHI must not be logged in plain text in application logs or error tracking tools.
- Access to PHI must be limited to authenticated, authorised staff only (enforced via RBAC).

**Audit trail:**
- All access to client health data (conditions, allergies) is logged with user ID, timestamp, and action type

---

## 5. Data Model

```
organizations
  id, name, created_at

branches
  id, organization_id, name, address, city, province, phone, email, is_active, created_at

users
  id, branch_id (nullable for super_admin), organization_id, name, email, password_hash,
  role (super_admin | branch_admin | staff), is_active, created_at

clients
  id, branch_id, name, email, phone, date_of_birth, conditions, allergies,
  insurance_provider, insurance_policy_number, email_consent, consent_date,
  is_deleted, deleted_at, created_by (user_id), created_at, updated_at

prescriptions
  id, client_id, branch_id, medication_name, medication_form, dosage, frequency,
  quantity_dispensed, daily_usage_rate, dispense_date, expected_end_date,
  estimated_end_date (computed), reminder_days_threshold, status, notes,
  created_by (user_id), created_at, updated_at

refill_history
  id, client_id, prescription_id, dispensed_by (user_id), branch_id, created_at

reminder_logs
  id, prescription_id, client_id, branch_id, sent_at, email_address, status, error_message

audit_logs
  id, user_id, branch_id, action (CREATE | UPDATE | DELETE | VIEW_SENSITIVE),
  resource_type, resource_id, metadata (JSON), created_at
```

---

## 6. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18 + TypeScript | Type safety, large ecosystem |
| Styling | Tailwind CSS | Fast UI development, consistent design |
| Backend | Node.js + Express | JS full-stack, strong cron/email ecosystem |
| ORM | Prisma | Type-safe DB access, clean migrations |
| Database | PostgreSQL 15 | Relational, proven for healthcare-adjacent data |
| Email | Resend | Simple API, reliable delivery, good free tier |
| Job scheduler | `node-cron` | Lightweight daily cron without Redis dependency |
| Auth | JWT (access + refresh tokens) | Stateless, easy to implement RBAC |
| Hosting | DigitalOcean Toronto (`tor1`) | PHIPA-compliant Canadian data residency |
| File storage | Not required in v1 | — |

---

## 7. User Flows

### Flow 1 — Add a New Client and Prescription

1. Staff logs in → lands on branch dashboard
2. Clicks "New Client" → fills in client form (name, email, DOB, etc.)
3. Toggles email consent ON → consent date recorded
4. Saves client → client profile created
5. From client profile, clicks "Add Prescription"
6. Fills in: medication name, form, dosage, frequency, quantity, dispense date
7. System auto-calculates estimated end date
8. Staff reviews, optionally adjusts reminder threshold
9. Saves → prescription goes live; reminder engine will pick it up on next daily run

### Flow 2 — Daily Reminder Run

1. Cron job fires at 8:00 AM
2. Queries all `active` prescriptions where end date or estimated end date ≤ threshold
3. Filters out clients with `email_consent = false`
4. Filters out prescriptions that already received a reminder in the last 48h
5. Sends email via Resend for each qualifying prescription
6. Logs result (sent / failed) to `reminder_logs`

### Flow 3 — Client Receives Reminder

1. Client receives email: "Hi [Name], your [Medication] supply is running low..."
2. Email includes: pharmacy name, branch address, phone number
3. Client calls or visits the branch to arrange a refill
4. Staff records the new refill as a new prescription entry → history updated

### Flow 4 — Super Admin Reviews All Branches

1. Super admin logs in → sees cross-branch dashboard
2. Views per-branch stats: active clients, prescriptions expiring soon, reminders sent
3. Can drill into any branch to view its clients and staff
4. Can create a new branch and assign a branch admin

---

## 8. Milestones & Phasing

### Phase 1 — Core (MVP)
- Auth system (all roles)
- Branch and staff management
- Client CRUD
- Prescription CRUD + refill history
- Daily reminder engine + email delivery
- Basic branch dashboard

### Phase 2 — Operations
- Super admin cross-branch dashboard
- Reminder logs view
- Audit log viewer (super admin)
- Client data export (PIPEDA compliance)
- Client soft-delete

### Phase 3 — Polish
- Email template customization per branch (logo, colors)
- Configurable reminder windows (e.g. 7 days + 3 days)
- Prescription status management (mark as completed/cancelled)
- Basic reporting: reminders sent per month, refill rate per medication

### Future Consideration (Post-v1)
- SMS reminders (Twilio)
- Patient-facing portal
- Integration with Kroll or other pharmacy software
- Multi-language email templates (French for Quebec compliance)
- Mobile app (React Native)

---

## 9. Open Questions

| # | Question | Priority | Status |
|---|---|---|---|
| 1 | Which Canadian province(s) will this operate in? | High | **Resolved — Ontario. PHIPA applies. Hosting: DigitalOcean Toronto.** |
| 2 | Is there a specific pharmacy name/brand to apply to email templates? | Medium | Open |
| 3 | Should multiple staff members at a branch receive internal alerts when a reminder fails to send? | Low | Open |
| 4 | Should clients receive a confirmation email when they are first added (consent acknowledgement)? | Low | Open |

---

*PRD v1.0 — Pharmacy Prescription Manager*
