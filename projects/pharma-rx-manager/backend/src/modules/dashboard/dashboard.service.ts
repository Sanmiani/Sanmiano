import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

const ONE_WEEK_AGO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d
}

const SEVEN_DAYS_FROM_NOW = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d
}

function branchFilter(actor: AuthUser) {
  return actor.role === 'super_admin' ? {} : { branchId: actor.branchId as string }
}

export async function getBranchSummary(actor: AuthUser) {
  if (actor.role === 'super_admin') {
    throw new AppError('FORBIDDEN', 'Use getSuperAdminSummary for super_admin accounts')
  }

  const branchId = actor.branchId as string
  const now = new Date()
  const sevenDaysOut = SEVEN_DAYS_FROM_NOW()
  const weekAgo = ONE_WEEK_AGO()

  const [activeClients, activePrescriptions, expiringSoon, remindersThisWeek] = await Promise.all([
    prisma.client.count({
      where: { branchId, isDeleted: false },
    }),
    prisma.prescription.count({
      where: { branchId, status: 'Active' },
    }),
    prisma.prescription.findMany({
      where: {
        branchId,
        status: 'Active',
        estimatedEndDate: { gte: now, lte: sevenDaysOut },
      },
      select: {
        id: true,
        clientId: true,
        medicationName: true,
        estimatedEndDate: true,
        client: { select: { name: true } },
      },
      orderBy: { estimatedEndDate: 'asc' },
    }),
    prisma.reminderLog.count({
      where: { branchId, sentAt: { gte: weekAgo } },
    }),
  ])

  return {
    activeClients,
    activePrescriptions,
    remindersThisWeek,
    expiringSoon: expiringSoon.map((rx) => ({
      id: rx.id,
      clientId: rx.clientId,
      clientName: rx.client.name,
      medicationName: rx.medicationName,
      estimatedEndDate: rx.estimatedEndDate,
      daysLeft: Math.ceil(
        (rx.estimatedEndDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    })),
  }
}

export async function getSuperAdminSummary(actor: AuthUser) {
  if (actor.role !== 'super_admin') {
    throw new AppError('FORBIDDEN', 'Only super_admin can access org-wide summary')
  }

  const weekAgo = ONE_WEEK_AGO()

  const branches = await prisma.branch.findMany({
    where: { organizationId: actor.organizationId, isActive: true },
    select: { id: true, name: true },
  })

  const [branchStats, totalClients, totalActivePrescriptions, totalRemindersThisWeek] =
    await Promise.all([
      Promise.all(
        branches.map(async (branch) => {
          const [activeClients, activePrescriptions, remindersThisWeek] = await Promise.all([
            prisma.client.count({ where: { branchId: branch.id, isDeleted: false } }),
            prisma.prescription.count({ where: { branchId: branch.id, status: 'Active' } }),
            prisma.reminderLog.count({
              where: { branchId: branch.id, sentAt: { gte: weekAgo } },
            }),
          ])
          return { id: branch.id, name: branch.name, activeClients, activePrescriptions, remindersThisWeek }
        })
      ),
      prisma.client.count({ where: { isDeleted: false } }),
      prisma.prescription.count({ where: { status: 'Active' } }),
      prisma.reminderLog.count({ where: { sentAt: { gte: weekAgo } } }),
    ])

  return {
    totalClients,
    totalActivePrescriptions,
    totalRemindersThisWeek,
    branches: branchStats,
  }
}
