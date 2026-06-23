import { decrypt } from '../services/cryptoService.js';

// List view: never includes the password, only the metadata needed for the UI.
export function toPublicEntry(row) {
  if (!row) return null;
  return {
    id: row.id,
    website: row.website,
    username: row.username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Detail view: decrypts the stored password on demand (only when explicitly
// requested for a single entry).
export function toEntryWithPassword(row) {
  if (!row) return null;
  return {
    ...toPublicEntry(row),
    password: decrypt({ cipher: row.password_cipher, iv: row.password_iv, tag: row.password_tag }),
  };
}
