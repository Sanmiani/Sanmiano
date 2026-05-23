import { Request, Response, NextFunction } from 'express'
import * as dashboardService from './dashboard.service'
import type { AuthUser } from '../../lib/audit'

export async function getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user as AuthUser
    const data =
      actor.role === 'super_admin'
        ? await dashboardService.getSuperAdminSummary(actor)
        : await dashboardService.getBranchSummary(actor)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
