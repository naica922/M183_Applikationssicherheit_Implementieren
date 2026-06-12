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
