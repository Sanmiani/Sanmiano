import cron from 'node-cron'
import { differenceInDays } from 'date-fns'
import { prisma } from '../lib/prisma'
import { sendReminderEmail } from '../lib/email'

// Two windows: first at 7 days, second at 3 days
const REMINDER_WINDOWS = [7, 3]

async function hasReminderForWindow(prescriptionId: string, window: number): Promise<boolean> {
  const existing = await prisma.reminderLog.findFirst({
    where: { prescriptionId, reminderWindow: window, status: 'Sent' },
  })
  return !!existing
}

async function runReminderJob(): Promise<void> {
  const prescriptions = await prisma.prescription.findMany({
    where: {
      status: 'Active',
      client: { emailConsent: true, isDeleted: false },
    },
    include: {
      client: { select: { id: true, name: true, email: true, emailConsent: true } },
      branch: { select: { id: true, name: true, phone: true, email: true, accentColour: true, logoUrl: true } },
    },
  })

  let sent = 0
  let failed = 0
  let skipped = 0

  for (const prescription of prescriptions) {
    const { client, branch } = prescription
    const effectiveEnd = prescription.expectedEndDate ?? prescription.estimatedEndDate

    if (!effectiveEnd) {
      skipped++
      continue
    }

    const daysLeft = differenceInDays(effectiveEnd, new Date())

    for (const window of REMINDER_WINDOWS) {
      if (daysLeft > window) continue
      if (await hasReminderForWindow(prescription.id, window)) continue

      try {
        await sendReminderEmail(prescription, client, branch, daysLeft)
        await prisma.reminderLog.create({
          data: {
            prescriptionId: prescription.id,
            clientId: client.id,
            branchId: branch.id,
            emailAddress: client.email,
            status: 'Sent',
            reminderWindow: window,
          },
        })
        sent++
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown send error'
        await prisma.reminderLog.create({
          data: {
            prescriptionId: prescription.id,
            clientId: client.id,
            branchId: branch.id,
            emailAddress: client.email,
            status: 'Failed',
            reminderWindow: window,
            errorMessage,
          },
        })
        failed++
      }
    }
  }

  console.log(`[reminder-job] sent=${sent} failed=${failed} skipped=${skipped}`)
}

export function startReminderJob(): void {
  // Runs daily at 08:00 server time
  cron.schedule('0 8 * * *', () => {
    runReminderJob().catch((err) => {
      console.error('[reminder-job] Fatal error:', err instanceof Error ? err.message : String(err))
    })
  })
  console.log('[reminder-job] Scheduled — runs daily at 08:00')
}
