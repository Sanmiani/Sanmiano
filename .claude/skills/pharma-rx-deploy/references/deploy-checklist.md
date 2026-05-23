# Pharma RX — Production Deploy Checklist

Run through every item before go-live and after any major update.

## Infrastructure

- [ ] PostgreSQL cluster region: DigitalOcean **Toronto (`tor1`)**
- [ ] App Platform region: **Toronto (`tor1`)**
- [ ] No US-region resources in use anywhere
- [ ] DO Data Processing Agreement (DPA) signed and on file

## PHIPA / Security

- [ ] `NODE_ENV=production` set in App Platform env
- [ ] All environment variables set via App Platform secrets — none committed to repo
- [ ] No `console.log` statements output PHI (conditions, allergies, prescription data)
- [ ] Error responses to client contain no PHI or stack traces
- [ ] HTTPS enforced — App Platform handles TLS termination
- [ ] Rate limiting active on `/auth/login` endpoint
- [ ] JWT secrets are ≥ 64 random hex chars (not default or short values)
- [ ] Passwords stored as bcrypt hashes (salt rounds ≥ 12) — never plaintext

## Database

- [ ] Managed PostgreSQL `tor1` cluster running
- [ ] `DATABASE_URL` set to the managed DB connection string (not a local URL)
- [ ] `npx prisma migrate deploy` runs successfully in build/run command
- [ ] No pending unapplied migrations
- [ ] Daily automated snapshots enabled on DO managed DB (default: ON)

## Application

- [ ] `/health` endpoint returns `{ status: "ok", db: "connected" }`
- [ ] Login flow works end-to-end (create user → login → receive JWT)
- [ ] Branch scoping verified: staff user cannot access clients from another branch
- [ ] Reminder cron job scheduled and confirmed firing (check logs after 8 AM)
- [ ] Email delivery tested with a real email address (Resend dashboard shows delivered)
- [ ] `email_consent = false` client does NOT receive a reminder email

## Access control

- [ ] `super_admin` account created and password changed from seed default
- [ ] No test accounts left active in production
- [ ] `staff` role cannot access `/branches` or `/users` endpoints

## Post-deploy smoke test

1. Log in as `super_admin` → create a branch
2. Create a `branch_admin` for that branch → log in as them
3. Create a client with `email_consent = true`
4. Create a prescription with `estimatedEndDate = today + 3 days`
5. Manually trigger the reminder job (or wait for 8 AM run)
6. Confirm reminder email arrives
7. Confirm `ReminderLog` entry created in DB
8. Confirm `AuditLog` entry created when prescription was viewed
