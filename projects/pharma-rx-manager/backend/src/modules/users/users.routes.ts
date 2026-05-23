import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { requireRole } from '../../middleware/rbac'
import * as usersController from './users.controller'

const router = Router()

router.use(authenticate)

// All authenticated users can change their own password
router.post('/me/change-password', usersController.changePassword)

// Staff management — branch_admin and super_admin only
router.get('/', requireRole(['super_admin', 'branch_admin']), usersController.list)
router.get('/:id', requireRole(['super_admin', 'branch_admin']), usersController.getById)
router.post('/', requireRole(['super_admin', 'branch_admin']), usersController.create)
router.patch('/:id', requireRole(['super_admin', 'branch_admin']), usersController.update)
router.patch('/:id/deactivate', requireRole(['super_admin', 'branch_admin']), usersController.deactivate)
router.patch('/:id/reactivate', requireRole(['super_admin', 'branch_admin']), usersController.reactivate)

export default router
