import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// Einfacher Health-Check: lebt der Server und ist die DB erreichbar?
router.get('/', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

export default router;
