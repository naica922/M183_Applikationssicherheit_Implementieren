import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  setupTwoFactor,
  enableTwoFactor,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { requireCsrf } from '../middleware/csrf.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
// Cookie-authenticated endpoints are protected against CSRF.
router.post('/refresh', requireCsrf, refresh);
router.post('/logout', requireCsrf, logout);
router.post('/2fa/setup', requireAuth, setupTwoFactor);
router.post('/2fa/enable', requireAuth, enableTwoFactor);

export default router;
