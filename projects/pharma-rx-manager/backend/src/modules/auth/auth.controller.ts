import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { registerSchema, loginSchema } from './auth.service'
import { AppError } from '../../lib/errors'

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = registerSchema.safeParse(req.body)
    if (!dto.success) {
      next(new AppError('VALIDATION_ERROR', dto.error.errors[0].message))
      return
    }
    const result = await authService.register(dto.data)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = loginSchema.safeParse(req.body)
    if (!dto.success) {
      next(new AppError('VALIDATION_ERROR', dto.error.errors[0].message))
      return
    }
    const result = await authService.login(dto.data)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken?: string }
    if (!refreshToken) {
      next(new AppError('VALIDATION_ERROR', 'refreshToken is required'))
      return
    }
    const result = await authService.refreshTokens(refreshToken)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function resetRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body as { email?: string }
    if (!email) {
      next(new AppError('VALIDATION_ERROR', 'email is required'))
      return
    }
    await authService.resetPasswordRequest(email)
    res.json({ success: true, data: { message: 'If that email exists, a reset link has been sent.' } })
  } catch (err) {
    next(err)
  }
}

export function me(req: Request, res: Response): void {
  res.json({ success: true, data: req.user })
}

export function adminCheck(_req: Request, res: Response): void {
  res.json({ success: true, data: { message: 'super_admin access confirmed' } })
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, newPassword } = req.body as { token?: string; newPassword?: string }
    if (!token || !newPassword) {
      next(new AppError('VALIDATION_ERROR', 'token and newPassword are required'))
      return
    }
    if (newPassword.length < 8) {
      next(new AppError('VALIDATION_ERROR', 'Password must be at least 8 characters'))
      return
    }
    await authService.resetPassword(token, newPassword)
    res.json({ success: true, data: { message: 'Password updated. Please log in.' } })
  } catch (err) {
    next(err)
  }
}
