import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { requireRole } from '../../middleware/rbac'
import * as controller from './audit.controller'

const router = Router()

router.get('/', authenticate, requireRole(['super_admin', 'branch_admin']), controller.list)

export default router
