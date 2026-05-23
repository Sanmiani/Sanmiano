import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import * as controller from './prescriptions.controller'

const router = Router()

router.get('/client/:clientId', authenticate, controller.listForClient)
router.post('/', authenticate, controller.create)
router.get('/:id', authenticate, controller.getById)
router.patch('/:id', authenticate, controller.update)
router.post('/:id/cancel', authenticate, controller.cancel)
router.post('/:id/complete', authenticate, controller.complete)

export default router
