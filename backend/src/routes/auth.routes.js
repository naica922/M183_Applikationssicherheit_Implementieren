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

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/2fa/setup', requireAuth, setupTwoFactor);
router.post('/2fa/enable', requireAuth, enableTwoFactor);

export default router;
