import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { resend } from '../../lib/email'
import { env } from '../../config/env'
import { AppError } from '../../lib/errors'
import type { AuthUser } from '../../lib/audit'

const ACCESS_TTL = '15m'
const REFRESH_TTL = '7d'
const RESET_TTL = '1h'

function issueTokens(actor: AuthUser): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign(actor, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL })
  const refreshToken = jwt.sign(
    { sub: actor.id, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TTL }
  )
  return { accessToken, refreshToken }
}

function toActor(user: {
  id: string
  role: 'super_admin' | 'branch_admin' | 'staff'
  branchId: string | null
  organizationId: string
}): AuthUser {
  return { id: user.id, role: user.role, branchId: user.branchId, organizationId: user.organizationId }
}

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  organizationId: z.string().min(1),
  branchId: z.string().optional().nullable(),
  role: z.enum(['super_admin', 'branch_admin', 'staff']).default('staff'),
})

export type RegisterDto = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type LoginDto = z.infer<typeof loginSchema>

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } })
  if (existing) throw new AppError('VALIDATION_ERROR', 'Email already in use')

  const passwordHash = await bcrypt.hash(dto.password, 12)
  const user = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      organizationId: dto.organizationId,
      branchId: dto.branchId ?? null,
    },
  })

  const tokens = issueTokens(toActor(user))
  return {
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, branchId: user.branchId, organizationId: user.organizationId },
  }
}

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({ where: { email: dto.email } })
  if (!user || !user.isActive) throw new AppError('UNAUTHORIZED', 'Invalid credentials')

  const valid = await bcrypt.compare(dto.password, user.passwordHash)
  if (!valid) throw new AppError('UNAUTHORIZED', 'Invalid credentials')

  if (user.branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: user.branchId } })
    if (!branch?.isActive) throw new AppError('UNAUTHORIZED', 'Branch is deactivated')
  }

  const tokens = issueTokens(toActor(user))
  return {
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, branchId: user.branchId, organizationId: user.organizationId },
  }
}

export async function refreshTokens(refreshToken: string) {
  let payload: { sub: string; type: string }
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; type: string }
  } catch {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired refresh token')
  }

  if (payload.type !== 'refresh') throw new AppError('UNAUTHORIZED', 'Invalid token type')

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || !user.isActive) throw new AppError('UNAUTHORIZED', 'User not found or inactive')

  return issueTokens(toActor(user))
}

export async function resetPasswordRequest(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // silent — prevents email enumeration

  const resetToken = jwt.sign({ sub: user.id, type: 'reset' }, env.JWT_REFRESH_SECRET, { expiresIn: RESET_TTL })
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`

  await resend.emails.send({
    from: 'noreply@pharmacy.ca',
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>Hi ${user.name},</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
  })
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  let payload: { sub: string; type: string }
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; type: string }
  } catch {
    throw new AppError('VALIDATION_ERROR', 'Invalid or expired reset token')
  }

  if (payload.type !== 'reset') throw new AppError('VALIDATION_ERROR', 'Invalid token type')

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } })
}
