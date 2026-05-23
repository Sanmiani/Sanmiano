import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

export const auditQuerySchema = z.object({
  userId: z.string().optional(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'VIEW_SENSITIVE']).optional(),
  resourceType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export type AuditQuery = z.infer<typeof auditQuerySchema>

const auditSelect = {
  id: true,
  action: true,
  resourceType: true,
  resourceId: true,
  metadata: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true, role: true } },
  branch: { select: { id: true, name: true } },
} as const

export async function list(actor: AuthUser, query: AuditQuery) {
  if (actor.role !== 'super_admin' && actor.role !== 'branch_admin') {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }

  const { userId, action, resourceType, from, to, page, limit } = query

  const where: Record<string, unknown> = {}

  if (actor.role === 'branch_admin') {
    where.branchId = actor.branchId
  }

  if (userId) where.userId = userId
  if (action) where.action = action
  if (resourceType) where.resourceType = resourceType

  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      select: auditSelect,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ])

  return { logs, total, page, limit }
}
