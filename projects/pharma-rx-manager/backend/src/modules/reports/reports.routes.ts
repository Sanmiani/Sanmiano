import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { requireRole } from '../../middleware/rbac'
import * as controller from './reports.controller'

const router = Router()

router.get('/monthly', authenticate, requireRole(['branch_admin', 'super_admin']), controller.getMonthlySummary)
router.get('/monthly/csv', authenticate, requireRole(['branch_admin', 'super_admin']), controller.downloadMonthlyCsv)

export default router
