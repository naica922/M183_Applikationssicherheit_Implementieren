import { query } from '../config/db.js';

// Every read and write is scoped by user_id so a user can never touch another
// user's entries, even when guessing ids (protection against IDOR).

export async function createEntry({ userId, website, username, password }) {
  const result = await query(
    `INSERT INTO vault_entries (user_id, website, username, password_cipher, password_iv, password_tag)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, website, username, password.cipher, password.iv, password.tag],
  );
  return result.rows[0];
}

export async function findByUser(userId) {
  const result = await query(
    'SELECT * FROM vault_entries WHERE user_id = $1 ORDER BY website ASC',
    [userId],
  );
  return result.rows;
}

export async function findByIdForUser(id, userId) {
  const result = await query('SELECT * FROM vault_entries WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return result.rows[0] || null;
}

export async function updateEntry({ id, userId, website, username, password }) {
  const result = await query(
    `UPDATE vault_entries
       SET website = $1, username = $2, password_cipher = $3, password_iv = $4, password_tag = $5
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [website, username, password.cipher, password.iv, password.tag, id, userId],
  );
  return result.rows[0] || null;
}

export async function deleteEntry(id, userId) {
  const result = await query('DELETE FROM vault_entries WHERE id = $1 AND user_id = $2 RETURNING id', [
    id,
    userId,
  ]);
  return result.rowCount > 0;
}
