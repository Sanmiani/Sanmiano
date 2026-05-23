import bcrypt from 'bcrypt'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  branchId: true,
  createdAt: true,
} as const

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['branch_admin', 'staff']),
  branchId: z.string().min(1, 'Branch is required'),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['branch_admin', 'staff']).optional(),
  isActive: z.boolean().optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>

export async function list(actor: AuthUser) {
  const where =
    actor.role === 'super_admin'
      ? { role: { not: 'super_admin' as const } }
      : { branchId: actor.branchId, role: { not: 'super_admin' as const } }

  return prisma.user.findMany({ where, select: userSelect, orderBy: { name: 'asc' } })
}

export async function getById(id: string, actor: AuthUser) {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect })
  if (!user) throw new AppError('NOT_FOUND', 'User not found')
  if (actor.role !== 'super_admin' && user.branchId !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }
  return user
}

export async function create(dto: CreateUserDto, actor: AuthUser) {
  if (actor.role === 'staff') throw new AppError('FORBIDDEN', 'Insufficient permissions')
  if (actor.role === 'branch_admin' && dto.branchId !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Cannot create users for other branches')
  }

  const branch = await prisma.branch.findUnique({ where: { id: dto.branchId } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  if (!branch.isActive) throw new AppError('VALIDATION_ERROR', 'Branch is deactivated')

  const existing = await prisma.user.findUnique({ where: { email: dto.email } })
  if (existing) throw new AppError('VALIDATION_ERROR', 'Email already in use')

  const passwordHash = await bcrypt.hash(dto.password, 12)
  return prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      branchId: dto.branchId,
      organizationId: branch.organizationId,
    },
    select: userSelect,
  })
}

export async function update(id: string, dto: UpdateUserDto, actor: AuthUser) {
  if (actor.role === 'staff') throw new AppError('FORBIDDEN', 'Insufficient permissions')
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('NOT_FOUND', 'User not found')
  if (actor.role !== 'super_admin' && user.branchId !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }
  return prisma.user.update({ where: { id }, data: dto, select: userSelect })
}

export async function deactivate(id: string, actor: AuthUser) {
  if (actor.role === 'staff') throw new AppError('FORBIDDEN', 'Insufficient permissions')
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('NOT_FOUND', 'User not found')
  if (actor.role !== 'super_admin' && user.branchId !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }
  if (user.id === actor.id) throw new AppError('VALIDATION_ERROR', 'Cannot deactivate yourself')
  return prisma.user.update({ where: { id }, data: { isActive: false }, select: userSelect })
}

export async function reactivate(id: string, actor: AuthUser) {
  if (actor.role === 'staff') throw new AppError('FORBIDDEN', 'Insufficient permissions')
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('NOT_FOUND', 'User not found')
  if (actor.role !== 'super_admin' && user.branchId !== actor.branchId) {
    throw new AppError('FORBIDDEN', 'Insufficient permissions')
  }
  return prisma.user.update({ where: { id }, data: { isActive: true }, select: userSelect })
}

export async function changePassword(dto: ChangePasswordDto, actor: AuthUser): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: actor.id } })
  if (!user) throw new AppError('NOT_FOUND', 'User not found')
  const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash)
  if (!valid) throw new AppError('UNAUTHORIZED', 'Current password is incorrect')
  const passwordHash = await bcrypt.hash(dto.newPassword, 12)
  await prisma.user.update({ where: { id: actor.id }, data: { passwordHash } })
}
