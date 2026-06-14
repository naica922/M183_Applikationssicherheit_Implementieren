const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

export function validateRegister(body) {
  const errors = [];
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (username.length < 3 || username.length > 50) {
    errors.push('Username must be between 3 and 50 characters.');
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.push('Username may only contain letters, numbers, and . _ -');
  }

  if (password.length < 12 || password.length > 128) {
    errors.push('Master password must be between 12 and 128 characters.');
  }

  return { valid: errors.length === 0, errors, value: { username, password } };
}

export function validateLogin(body) {
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const valid = username.length > 0 && password.length > 0;
  return { valid, value: { username, password } };
}
