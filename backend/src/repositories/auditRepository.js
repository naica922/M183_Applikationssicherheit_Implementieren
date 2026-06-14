import { query } from '../config/db.js';

export async function logEvent({ userId = null, eventType, ipAddress = null, userAgent = null, metadata = null }) {
  await query(
    `INSERT INTO audit_log (user_id, event_type, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, eventType, ipAddress, userAgent, metadata],
  );
}
