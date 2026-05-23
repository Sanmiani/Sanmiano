---
name: pharma-rx-deploy
description: Use when deploying the Pharmacy Prescription Manager to DigitalOcean Toronto — covers first-time setup, environment variables, database provisioning, migration steps, and PHIPA compliance verification before go-live
---

# Pharma RX — Deployment Workflow (DigitalOcean Toronto)

## PHIPA requirement

All infrastructure must be in the **Toronto (`tor1`)** region. This is non-negotiable — see `projects/pharma-rx-manager/PRD.md` Section 4.4.

Before deploying to production, confirm:
- App Droplet or App Platform app is in `tor1`
- Managed PostgreSQL cluster is in `tor1`
- No external logging or error tracking service receives PHI (conditions, allergies, prescription details)

## Infrastructure (DigitalOcean)

Recommended setup:
- **Database**: DigitalOcean Managed PostgreSQL (Basic plan, `tor1`) — ~$15/month
- **App**: DigitalOcean App Platform (Basic, `tor1`) — ~$5–12/month
- **Domain**: Point a subdomain (e.g. `app.pharmacyname.ca`) via DigitalOcean DNS

Full checklist in `references/deploy-checklist.md`.

## First-time setup sequence

### 1. Provision database

```bash
# Via DO CLI
doctl databases create pharma-rx-db \
  --engine pg \
  --version 15 \
  --region tor1 \
  --size db-s-1vcpu-1gb \
  --num-nodes 1
```

Copy the connection string into the app's environment as `DATABASE_URL`.

### 2. Configure environment variables (App Platform)

Set these in the App Platform environment settings — never commit to source control:

```
DATABASE_URL          = (from DO managed DB connection string)
JWT_ACCESS_SECRET     = (random 64-char hex string)
JWT_REFRESH_SECRET    = (random 64-char hex string)
RESEND_API_KEY        = (from resend.com dashboard)
NODE_ENV              = production
PORT                  = 8080
```

Generate secrets: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Run migrations on deploy

Add this as the **run command** in App Platform (not build command):

```bash
npx prisma migrate deploy && node dist/server.js
```

`prisma migrate deploy` applies pending migrations only — never resets data in production.

### 4. Seed initial super_admin

After first deploy, run once:

```bash
# From local machine, with production DATABASE_URL
npx ts-node backend/prisma/seed.ts
```

Seed creates one `Organization` + one `super_admin` user. Credentials are output to console — change the password immediately after first login.

## Deploy checklist

See `references/deploy-checklist.md` for the full go/no-go list.

## Ongoing deployments

- Push to `main` triggers redeploy via App Platform's GitHub integration
- Migrations run automatically on each deploy via the run command above
- Check the build logs in DO App Platform after every deploy — look for migration errors before declaring success

## Rollback procedure

If a deploy breaks the app:
1. In App Platform → Deployments → select the previous successful deployment → Rollback
2. If the rollback involves a schema migration, assess whether the migration is reversible
3. If not reversible: restore the database from the most recent automated snapshot (DO takes daily snapshots)

## Monitoring

DigitalOcean App Platform provides basic metrics (CPU, memory, request count). For production:
- Set an uptime alert on the `/health` endpoint (200 = healthy)
- Alert on error rate > 1% over 5 minutes

The `/health` endpoint should return `{ status: "ok", db: "connected" }` and check the DB connection.

## DPA / compliance

Before storing real patient data:
- Sign DigitalOcean's Data Processing Agreement (DPA) at `cloud.digitalocean.com/account/legal`
- Keep a copy of the signed DPA on file for the pharmacy
- Confirm with the pharmacy that client consent language is in place at point of client onboarding
