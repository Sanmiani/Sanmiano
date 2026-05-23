# Pharma RX — Prisma Schema Reference

Full schema for `backend/prisma/schema.prisma`. Use this as the source of truth when writing queries, migrations, or new modules.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  super_admin
  branch_admin
  staff
}

enum MedicationForm {
  Tablet
  Capsule
  Liquid
  Cream
  Inhaler
  Other
}

enum PrescriptionStatus {
  Active
  Completed
  Cancelled
}

enum ReminderStatus {
  Sent
  Failed
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  VIEW_SENSITIVE
}

model Organization {
  id         String   @id @default(cuid())
  name       String
  createdAt  DateTime @default(now())
  branches   Branch[]
  users      User[]
}

model Branch {
  id             String       @id @default(cuid())
  organizationId String
  name           String
  address        String?
  city           String?
  province       String       @default("ON")
  phone          String?
  email          String?
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  organization   Organization @relation(fields: [organizationId], references: [id])
  users          User[]
  clients        Client[]
  prescriptions  Prescription[]
  reminderLogs   ReminderLog[]
  auditLogs      AuditLog[]
}

model User {
  id             String       @id @default(cuid())
  organizationId String
  branchId       String?      // null for super_admin
  name           String
  email          String       @unique
  passwordHash   String
  role           Role
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  organization   Organization @relation(fields: [organizationId], references: [id])
  branch         Branch?      @relation(fields: [branchId], references: [id])
  prescriptions  Prescription[]
  auditLogs      AuditLog[]
}

model Client {
  id                   String         @id @default(cuid())
  branchId             String
  name                 String
  email                String
  phone                String?
  dateOfBirth          DateTime
  conditions           String?        // PHI — audit on read/write
  allergies            String?        // PHI — audit on read/write
  insuranceProvider    String?
  insurancePolicyNum   String?
  emailConsent         Boolean        @default(false)
  consentDate          DateTime?
  isDeleted            Boolean        @default(false)
  deletedAt            DateTime?
  createdBy            String
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  branch               Branch         @relation(fields: [branchId], references: [id])
  prescriptions        Prescription[]
  reminderLogs         ReminderLog[]
}

model Prescription {
  id                    String             @id @default(cuid())
  clientId              String
  branchId              String
  medicationName        String
  medicationForm        MedicationForm
  dosage                String?
  frequency             String?
  quantityDispensed     Int
  dailyUsageRate        Float
  dispenseDate          DateTime
  expectedEndDate       DateTime?          // manually set
  estimatedEndDate      DateTime?          // computed: dispenseDate + (qty / dailyUsageRate)
  reminderDaysThreshold Int                @default(7)
  status                PrescriptionStatus @default(Active)
  notes                 String?
  createdBy             String
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt
  client                Client             @relation(fields: [clientId], references: [id])
  branch                Branch             @relation(fields: [branchId], references: [id])
  createdByUser         User               @relation(fields: [createdBy], references: [id])
  reminderLogs          ReminderLog[]
}

model ReminderLog {
  id             String         @id @default(cuid())
  prescriptionId String
  clientId       String
  branchId       String
  sentAt         DateTime       @default(now())
  emailAddress   String
  status         ReminderStatus
  errorMessage   String?
  prescription   Prescription   @relation(fields: [prescriptionId], references: [id])
  client         Client         @relation(fields: [clientId], references: [id])
  branch         Branch         @relation(fields: [branchId], references: [id])
}

model AuditLog {
  id           String      @id @default(cuid())
  userId       String
  branchId     String?
  action       AuditAction
  resourceType String      // e.g. "Client", "Prescription"
  resourceId   String
  metadata     Json?
  createdAt    DateTime    @default(now())
  user         User        @relation(fields: [userId], references: [id])
  branch       Branch?     @relation(fields: [branchId], references: [id])
}
```

## Key computed values

**estimatedEndDate** — calculated at prescription creation:
```typescript
const days = Math.floor(prescription.quantityDispensed / prescription.dailyUsageRate)
const estimatedEndDate = addDays(prescription.dispenseDate, days)
```

**Effective end date for reminder trigger** — whichever comes first:
```typescript
const effectiveEnd = min([
  prescription.expectedEndDate,
  prescription.estimatedEndDate
].filter(Boolean))
```

## PHI fields

These fields contain Personal Health Information under PHIPA. Any service function that reads or writes them must call `auditLog()` before returning:

- `Client.conditions`
- `Client.allergies`
- All fields on `Prescription`
