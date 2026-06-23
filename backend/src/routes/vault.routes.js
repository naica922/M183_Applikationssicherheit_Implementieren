import { Router } from 'express';
import { list, get, create, update, remove } from '../controllers/vaultController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// All vault routes require a valid access token.
router.use(requireAuth);

router.get('/', list);
router.post('/', create);
router.get('/:id', get);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
