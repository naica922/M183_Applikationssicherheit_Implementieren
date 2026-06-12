import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);

// Weitere Routen werden hier registriert:
// router.use('/auth', authRoutes);
// router.use('/vault', vaultRoutes);

export default router;
