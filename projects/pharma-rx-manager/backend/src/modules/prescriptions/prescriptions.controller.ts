import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as prescriptionsService from './prescriptions.service'

export async function listForClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await prescriptionsService.listForClient(req.params.clientId, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await prescriptionsService.getById(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = prescriptionsService.createPrescriptionSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await prescriptionsService.create(parsed.data, req.user!)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = prescriptionsService.updatePrescriptionSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await prescriptionsService.update(req.params.id, parsed.data, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await prescriptionsService.cancel(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function complete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await prescriptionsService.complete(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
