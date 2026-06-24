import { Router } from 'express';
import { listOwnEvents } from '../controllers/auditController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, listOwnEvents);

export default router;
