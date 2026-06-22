import { query } from '../config/db.js';

// Returns the full row including password_hash; used by auth (login).
export async function findByUsername(username) {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export async function findById(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createUser({ username, passwordHash }) {
  const result = await query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
    [username, passwordHash],
  );
  return result.rows[0];
}

export async function setTotpSecret(userId, secret) {
  await query('UPDATE users SET totp_secret = $1, totp_enabled = false WHERE id = $2', [
    secret,
    userId,
  ]);
}

export async function enableTotp(userId) {
  await query('UPDATE users SET totp_enabled = true WHERE id = $1', [userId]);
}

// Counts a failed login and returns the new attempt total.
export async function incrementFailedAttempts(userId) {
  const result = await query(
    `UPDATE users SET failed_login_attempts = failed_login_attempts + 1
     WHERE id = $1 RETURNING failed_login_attempts`,
    [userId],
  );
  return result.rows[0]?.failed_login_attempts ?? 0;
}

export async function lockAccount(userId, lockedUntil) {
  await query('UPDATE users SET locked_until = $1 WHERE id = $2', [lockedUntil, userId]);
}

// Clears the lockout state after a successful login.
export async function resetFailedAttempts(userId) {
  await query(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
    [userId],
  );
}
