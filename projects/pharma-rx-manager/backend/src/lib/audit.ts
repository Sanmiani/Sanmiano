import { AuditAction } from '@prisma/client'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  role: 'super_admin' | 'branch_admin' | 'staff'
  branchId: string | null
  organizationId: string
}

export async function auditLog(
  actor: AuthUser,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: actor.id,
      branchId: actor.branchId ?? null,
      action,
      resourceType,
      resourceId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: metadata as any,
    },
  })
}
