import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import * as controller from './clients.controller'

const router = Router()

router.get('/', authenticate, controller.list)
router.post('/', authenticate, controller.create)
router.get('/:id/export', authenticate, controller.exportCsv)
router.get('/:id', authenticate, controller.getById)
router.patch('/:id', authenticate, controller.update)
router.delete('/:id', authenticate, controller.softDelete)

export default router
