import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import * as dashboardController from './dashboard.controller'

const router = Router()

router.get('/', authenticate, dashboardController.getSummary)

export default router
