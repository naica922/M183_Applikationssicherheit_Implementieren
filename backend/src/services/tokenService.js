import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createRefreshToken } from '../repositories/refreshTokenRepository.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

// Refresh tokens are random and only their hash is stored, never the raw value.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function issueRefreshToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + env.jwt.refreshTtlDays * 24 * 60 * 60 * 1000);
  await createRefreshToken({ userId, tokenHash: hashToken(token), expiresAt });
  return { token, expiresAt };
}
