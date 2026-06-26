// Decodes the payload of a JWT to read the username for display only. The
// signature is NOT verified here — the server always re-verifies every token.
export function decodeUserFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}
