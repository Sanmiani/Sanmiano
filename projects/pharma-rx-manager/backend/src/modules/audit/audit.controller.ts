import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as auditService from './audit.service'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = auditService.auditQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await auditService.list(req.user!, parsed.data)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
