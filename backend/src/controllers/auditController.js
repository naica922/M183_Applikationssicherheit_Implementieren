import { findByUser } from '../repositories/auditRepository.js';

// Lets a user review their own recent security events (logins, lockouts,
// vault changes). Scoped to req.user, so no one sees another user's log.
export async function listOwnEvents(req, res, next) {
  try {
    const rows = await findByUser(req.user.id);
    const events = rows.map((row) => ({
      eventType: row.event_type,
      ipAddress: row.ip_address,
      createdAt: row.created_at,
    }));
    res.json({ events });
  } catch (err) {
    next(err);
  }
}
