import crypto from 'node:crypto';
import { env } from '../config/env.js';

// AES-256-GCM provides confidentiality and integrity (the auth tag detects
// tampering). The 256-bit key is derived once from a server-side master secret
// via PBKDF2 so the raw secret never has to be the exact key length.
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit nonce, recommended for GCM
const KEY_LENGTH = 32; // 256-bit key
const PBKDF2_ITERATIONS = 100_000;

let cachedKey = null;

function getKey() {
  if (!cachedKey) {
    cachedKey = crypto.pbkdf2Sync(
      env.crypto.masterKey,
      env.crypto.keySalt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      'sha256',
    );
  }
  return cachedKey;
}

// Encrypts a UTF-8 string and returns the ciphertext together with the random
// IV and the GCM auth tag (all as Buffers, matching the bytea columns).
export function encrypt(plaintext) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { cipher: ciphertext, iv, tag };
}

// Reverses encrypt(); throws if the auth tag does not match (tampered data).
export function decrypt({ cipher, iv, tag }) {
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(cipher), decipher.final()]);
  return plaintext.toString('utf8');
}
