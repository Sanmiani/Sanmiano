import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma'
import { AppError } from './lib/errors'
import authRoutes from './modules/auth/auth.routes'
import branchRoutes from './modules/branches/branches.routes'
import userRoutes from './modules/users/users.routes'
import clientRoutes from './modules/clients/clients.routes'
import prescriptionRoutes from './modules/prescriptions/prescriptions.routes'
import reminderRoutes from './modules/reminders/reminders.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import auditRoutes from './modules/audit/audit.routes'
import reportRoutes from './modules/reports/reports.routes'
import { env } from './config/env'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/branches', branchRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/reports', reportRoutes)

app.get('/health', async (_req: Request, res: Response): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

// Global error handler — must have 4 params for Express to recognise it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    })
    return
  }
  console.error(err)
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  })
})

export default app
