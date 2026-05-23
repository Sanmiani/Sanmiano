import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import * as remindersController from './reminders.controller'

const router = Router()

router.get('/', authenticate, remindersController.listForBranch)
router.get('/client/:clientId', authenticate, remindersController.listForClient)

export default router
