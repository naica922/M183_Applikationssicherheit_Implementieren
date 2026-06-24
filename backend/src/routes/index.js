import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import vaultRoutes from './vault.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vault', vaultRoutes);
router.use('/audit', auditRoutes);

export default router;
