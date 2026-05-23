# Deploy Checklist — Pharma RX Manager

Run this before and after every production deployment. Sign off each item.

## Pre-deploy: Infrastructure

- [ ] DigitalOcean Managed PostgreSQL cluster is in **tor1** region
- [ ] App Platform app is in **tor1** region
- [ ] `app.yaml` `repo` field updated with actual GitHub repo
- [ ] GitHub repo connected to App Platform via GitHub integration
- [ ] DigitalOcean DPA signed at `cloud.digitalocean.com/account/legal`

## Pre-deploy: Environment variables

- [ ] `DATABASE_URL` set — connection string from DO Managed DB, includes `?sslmode=require`
- [ ] `JWT_ACCESS_SECRET` set — 64-char random hex (not reused from dev)
- [ ] `JWT_REFRESH_SECRET` set — 64-char random hex (not reused from dev)
- [ ] `RESEND_API_KEY` set — from resend.com dashboard
- [ ] `FRONTEND_URL` set — matches your actual domain (e.g. `https://app.pharmacyname.ca`)
- [ ] `EMAIL_FROM` set — matches your Resend verified sending domain
- [ ] `NODE_ENV=production`
- [ ] `PORT=8080`
- [ ] No `SECRET` env vars left empty or at placeholder values

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Pre-deploy: Code

- [ ] All migrations in `backend/prisma/migrations/` are committed
- [ ] `prisma/schema.prisma` matches the migration history (no drift)
- [ ] `npm run build` passes locally (backend)
- [ ] `npm run build` passes locally (frontend)
- [ ] No secrets or real patient data in the codebase or git history

## Pre-deploy: Email

- [ ] Resend sending domain is verified (DNS records confirmed)
- [ ] Test email sent from Resend dashboard to confirm deliverability
- [ ] `EMAIL_FROM` address matches the verified domain

## Post-deploy: Smoke test

Run this after every first deploy and after any breaking change.

1. [ ] `GET /health` returns `{ status: "ok", db: "connected" }` (200)
2. [ ] Login with `super_admin` seed credentials succeeds → redirected to dashboard
3. [ ] Create a branch (super_admin)
4. [ ] Create a staff user in that branch (branch_admin)
5. [ ] Create a client with email consent enabled
6. [ ] Create a prescription with qty and daily rate → confirm `estimatedEndDate` is calculated
7. [ ] Verify reminder job runs (check logs in App Platform for `[reminder-job]` output)
8. [ ] Confirm reminder email received (use a real inbox for smoke test)
9. [ ] Export client data CSV — file downloads with correct content
10. [ ] Audit log shows all actions performed above

## Post-deploy: Security

- [ ] Default `super_admin` seed password changed immediately after first login
- [ ] `/api/auth/login` rate limiter active (try 11 failed logins → expect 429)
- [ ] Non-authenticated request to `/api/clients` returns 401
- [ ] Staff from Branch A cannot access clients from Branch B (403)

## Post-deploy: Monitoring

- [ ] Uptime alert configured on `/health` endpoint in App Platform
- [ ] Alert fires if response is not 200 for 2 consecutive checks
- [ ] Rollback procedure confirmed: App Platform → Deployments → previous deploy → Rollback

## Compliance sign-off

- [ ] DPA with DigitalOcean signed and copy stored
- [ ] Pharmacy has reviewed and approved consent language shown to clients at onboarding
- [ ] No PHI (conditions, allergies, prescription details) appears in server logs
- [ ] Staff trained on soft-delete policy (no permanent deletion without legal authorization)

---

All 24 items above must pass before declaring the deployment **LIVE**.
