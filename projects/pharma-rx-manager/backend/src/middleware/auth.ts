import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../lib/errors'
import type { AuthUser } from '../lib/audit'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new AppError('UNAUTHORIZED', 'Missing auth token'))
    return
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser
    req.user = payload
    next()
  } catch {
    next(new AppError('UNAUTHORIZED', 'Invalid or expired token'))
  }
}
