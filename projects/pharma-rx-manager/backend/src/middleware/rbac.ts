import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import type { AuthUser } from '../lib/audit'

export function requireRole(roles: AuthUser['role'][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 'Not authenticated'))
      return
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('FORBIDDEN', 'Insufficient permissions'))
      return
    }
    next()
  }
}
