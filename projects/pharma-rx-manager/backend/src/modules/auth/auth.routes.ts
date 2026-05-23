import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as ctrl from './auth.controller'
import { authenticate } from '../../middleware/auth'
import { requireRole } from '../../middleware/rbac'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Try again in 15 minutes.' } },
})

router.post('/register', ctrl.register)
router.post('/login', loginLimiter, ctrl.login)
router.post('/refresh', ctrl.refresh)
router.post('/reset-request', ctrl.resetRequest)
router.post('/reset', ctrl.resetPassword)

// Protected — confirms req.user is attached after authenticate
router.get('/me', authenticate, ctrl.me)

// Super-admin only — used to verify RBAC returns 403 for lower roles
router.get('/admin-check', authenticate, requireRole(['super_admin']), ctrl.adminCheck)

export default router
