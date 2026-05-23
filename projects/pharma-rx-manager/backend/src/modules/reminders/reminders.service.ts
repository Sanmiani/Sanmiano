import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

function branchScope(actor: AuthUser) {
  return actor.role === 'super_admin' ? {} : { branchId: actor.branchId as string }
}

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export type ListQuery = z.infer<typeof listQuerySchema>

const reminderSelect = {
  id: true,
  prescriptionId: true,
  clientId: true,
  branchId: true,
  sentAt: true,
  emailAddress: true,
  status: true,
  reminderWindow: true,
  errorMessage: true,
  prescription: {
    select: { medicationName: true },
  },
  client: {
    select: { name: true },
  },
} as const

export async function listForBranch(actor: AuthUser, query: ListQuery) {
  const { page, limit } = query
  const where = branchScope(actor)

  const [logs, total] = await prisma.$transaction([
    prisma.reminderLog.findMany({
      where,
      select: reminderSelect,
      orderBy: { sentAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reminderLog.count({ where }),
  ])

  return { logs, total, page, limit }
}

export async function listForClient(clientId: string, actor: AuthUser) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, isDeleted: false, ...branchScope(actor) },
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  return prisma.reminderLog.findMany({
    where: { clientId, ...branchScope(actor) },
    select: reminderSelect,
    orderBy: { sentAt: 'desc' },
  })
}
