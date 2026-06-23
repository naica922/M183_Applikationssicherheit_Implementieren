const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

// Server-side validation for vault entries. The client is never trusted; all
// fields are length-checked before anything is encrypted or stored.
export function validateVaultEntry(body) {
  const errors = [];
  const website = typeof body?.website === 'string' ? body.website.trim() : '';
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (website.length < 1 || website.length > 255) {
    errors.push('Website is required and must be at most 255 characters.');
  }
  if (username.length < 1 || username.length > 255) {
    errors.push('Username is required and must be at most 255 characters.');
  }
  if (password.length < 1 || password.length > 1024) {
    errors.push('Password is required and must be at most 1024 characters.');
  }

  return { valid: errors.length === 0, errors, value: { website, username, password } };
}
