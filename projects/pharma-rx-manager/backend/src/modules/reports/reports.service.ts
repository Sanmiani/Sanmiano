import { z } from 'zod'
import { startOfMonth, endOfMonth } from 'date-fns'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

export const monthlyQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
})

export type MonthlyQuery = z.infer<typeof monthlyQuerySchema>

function branchScope(actor: AuthUser) {
  return actor.role === 'super_admin' ? {} : { branchId: actor.branchId as string }
}

export async function getMonthlySummary(actor: AuthUser, query: MonthlyQuery) {
  const { year, month } = query
  const periodStart = startOfMonth(new Date(year, month - 1, 1))
  const periodEnd = endOfMonth(periodStart)

  if (actor.role !== 'super_admin' && !actor.branchId) {
    throw new AppError('FORBIDDEN', 'Branch required')
  }

  const scope = branchScope(actor)

  const [prescriptionsDispensed, remindersSent, activeClients] = await Promise.all([
    prisma.prescription.count({
      where: {
        ...scope,
        dispenseDate: { gte: periodStart, lte: periodEnd },
      },
    }),
    prisma.reminderLog.count({
      where: {
        ...scope,
        status: 'Sent',
        sentAt: { gte: periodStart, lte: periodEnd },
      },
    }),
    prisma.client.count({
      where: {
        ...scope,
        isDeleted: false,
        prescriptions: { some: { status: 'Active' } },
      },
    }),
  ])

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
  })

  return {
    period: { year, month, label: monthLabel },
    prescriptionsDispensed,
    remindersSent,
    activeClients,
  }
}

export async function getMonthlyReportCsv(actor: AuthUser, query: MonthlyQuery): Promise<string> {
  const summary = await getMonthlySummary(actor, query)

  const rows = [
    `Monthly Report — ${summary.period.label}`,
    '',
    'Metric,Value',
    `Prescriptions Dispensed,${summary.prescriptionsDispensed}`,
    `Reminders Sent,${summary.remindersSent}`,
    `Active Clients (with active Rx),${summary.activeClients}`,
  ]

  return rows.join('\n')
}
