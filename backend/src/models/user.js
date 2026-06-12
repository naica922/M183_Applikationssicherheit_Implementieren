// Maps a raw users row to a safe object, never exposing password_hash or totp_secret.
export function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    totpEnabled: row.totp_enabled,
    createdAt: row.created_at,
  };
}
