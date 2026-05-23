import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as reportsService from './reports.service'

export async function getMonthlySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reportsService.monthlyQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await reportsService.getMonthlySummary(req.user!, parsed.data)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function downloadMonthlyCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = reportsService.monthlyQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const csv = await reportsService.getMonthlyReportCsv(req.user!, parsed.data)
    const { year, month } = parsed.data
    const filename = `report-${year}-${String(month).padStart(2, '0')}.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(csv)
  } catch (err) {
    next(err)
  }
}
