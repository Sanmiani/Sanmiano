import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

export const createBranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().default('ON'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

export type CreateBranchDto = z.infer<typeof createBranchSchema>

export const updateBranchSchema = createBranchSchema.partial()
export type UpdateBranchDto = z.infer<typeof updateBranchSchema>

export async function list(actor: AuthUser) {
  if (actor.role === 'super_admin') {
    return prisma.branch.findMany({ orderBy: { name: 'asc' } })
  }
  if (!actor.branchId) return []
  return prisma.branch.findMany({ where: { id: actor.branchId } })
}

export async function getById(id: string, actor: AuthUser) {
  const branch = await prisma.branch.findUnique({ where: { id } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  if (actor.role !== 'super_admin' && branch.id !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }
  return branch
}

export async function create(dto: CreateBranchDto, actor: AuthUser) {
  if (actor.role !== 'super_admin') throw new AppError('FORBIDDEN', 'Super admin only')
  return prisma.branch.create({
    data: {
      ...dto,
      email: dto.email || null,
      organizationId: actor.organizationId,
    },
  })
}

export async function update(id: string, dto: UpdateBranchDto, actor: AuthUser) {
  if (actor.role !== 'super_admin') throw new AppError('FORBIDDEN', 'Super admin only')
  const branch = await prisma.branch.findUnique({ where: { id } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  return prisma.branch.update({ where: { id }, data: dto })
}

export async function deactivate(id: string, actor: AuthUser) {
  if (actor.role !== 'super_admin') throw new AppError('FORBIDDEN', 'Super admin only')
  const branch = await prisma.branch.findUnique({ where: { id } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  return prisma.branch.update({ where: { id }, data: { isActive: false } })
}

export async function reactivate(id: string, actor: AuthUser) {
  if (actor.role !== 'super_admin') throw new AppError('FORBIDDEN', 'Super admin only')
  const branch = await prisma.branch.findUnique({ where: { id } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  return prisma.branch.update({ where: { id }, data: { isActive: true } })
}
