import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../lib/errors'
import * as usersService from './users.service'
import { createUserSchema, updateUserSchema, changePasswordSchema } from './users.service'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await usersService.list(req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await usersService.getById(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createUserSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await usersService.create(parsed.data, req.user!)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateUserSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    const data = await usersService.update(req.params.id, parsed.data, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await usersService.deactivate(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function reactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await usersService.reactivate(req.params.id, req.user!)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError('VALIDATION_ERROR', parsed.error.issues[0].message))
      return
    }
    await usersService.changePassword(parsed.data, req.user!)
    res.json({ success: true, data: null })
  } catch (err) {
    next(err)
  }
}
