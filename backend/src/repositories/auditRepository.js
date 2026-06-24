import { query } from '../config/db.js';

export async function logEvent({ userId = null, eventType, ipAddress = null, userAgent = null, metadata = null }) {
  await query(
    `INSERT INTO audit_log (user_id, event_type, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, eventType, ipAddress, userAgent, metadata],
  );
}

// Returns the most recent security events for one user (their own log only).
export async function findByUser(userId, limit = 50) {
  const result = await query(
    `SELECT event_type, ip_address, created_at
       FROM audit_log
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}
