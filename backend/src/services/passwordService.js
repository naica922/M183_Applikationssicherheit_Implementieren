import argon2 from 'argon2';

const options = { type: argon2.argon2id };

export function hashPassword(password) {
  return argon2.hash(password, options);
}

export function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}
