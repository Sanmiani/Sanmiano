import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as remindersService from './reminders.service'
import type { AuthUser } from '../../lib/audit'

export async function listForBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = remindersService.listQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await remindersService.listForBranch(req.user as AuthUser, parsed.data)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function listForClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await remindersService.listForClient(req.params.clientId, req.user as AuthUser)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
