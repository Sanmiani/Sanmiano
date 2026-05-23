import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as branchesService from './branches.service'
import { createBranchSchema, updateBranchSchema } from './branches.service'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await branchesService.list(req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await branchesService.getById(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createBranchSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await branchesService.create(parsed.data, req.user!)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateBranchSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await branchesService.update(req.params.id, parsed.data, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await branchesService.deactivate(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function reactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await branchesService.reactivate(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
