import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as clientsService from './clients.service'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = clientsService.listQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await clientsService.list(req.user!, parsed.data)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await clientsService.getById(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = clientsService.createClientSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await clientsService.create(parsed.data, req.user!)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = clientsService.updateClientSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await clientsService.update(req.params.id, parsed.data, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await clientsService.softDelete(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const csv = await clientsService.exportCsv(req.params.id, req.user!)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="client-${req.params.id}.csv"`)
    res.send(csv)
  } catch (err) {
    next(err)
  }
}
