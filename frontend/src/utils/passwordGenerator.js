const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}',
};

// Generates a random password using the cryptographically secure Web Crypto RNG
// (not Math.random).
export function generatePassword(length = 20, options = {}) {
  const { lower = true, upper = true, digits = true, symbols = true } = options;

  let pool = '';
  if (lower) pool += SETS.lower;
  if (upper) pool += SETS.upper;
  if (digits) pool += SETS.digits;
  if (symbols) pool += SETS.symbols;
  if (!pool) pool = SETS.lower;

  const random = new Uint32Array(length);
  crypto.getRandomValues(random);

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += pool[random[i] % pool.length];
  }
  return result;
}
