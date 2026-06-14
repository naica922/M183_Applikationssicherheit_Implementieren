import { query } from '../config/db.js';

export async function createRefreshToken({ userId, tokenHash, expiresAt }) {
  const result = await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
}

// Returns a token only if it exists, is not revoked, and is not expired.
export async function findValidByHash(tokenHash) {
  const result = await query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`,
    [tokenHash],
  );
  return result.rows[0] || null;
}

export async function revokeById(id) {
  await query('UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1', [id]);
}
