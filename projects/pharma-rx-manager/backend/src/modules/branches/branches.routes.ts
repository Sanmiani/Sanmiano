import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { requireRole } from '../../middleware/rbac'
import * as branchesController from './branches.controller'

const router = Router()

router.use(authenticate)

router.get('/', branchesController.list)
router.get('/:id', branchesController.getById)
router.post('/', requireRole(['super_admin']), branchesController.create)
router.patch('/:id', requireRole(['super_admin']), branchesController.update)
router.patch('/:id/deactivate', requireRole(['super_admin']), branchesController.deactivate)
router.patch('/:id/reactivate', requireRole(['super_admin']), branchesController.reactivate)

export default router
