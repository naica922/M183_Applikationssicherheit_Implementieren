import {
  createUser,
  findByUsername,
  findById,
  setTotpSecret,
  enableTotp,
  incrementFailedAttempts,
  lockAccount,
  resetFailedAttempts,
} from '../repositories/userRepository.js';
import { findValidByHash, revokeById } from '../repositories/refreshTokenRepository.js';
import { logEvent } from '../repositories/auditRepository.js';
import { hashPassword, verifyPassword } from './passwordService.js';
import { signAccessToken, issueRefreshToken, hashToken } from './tokenService.js';
import { generateSecret, buildSetup, verifyToken } from './totpService.js';
import { toPublicUser } from '../models/user.js';
import { httpError } from '../utils/httpError.js';
import { env } from '../config/env.js';

function isLocked(user) {
  return Boolean(user?.locked_until) && new Date(user.locked_until) > new Date();
}

// Counts a failed attempt and locks the account once the threshold is reached.
async function registerFailedAttempt({ user, ipAddress, userAgent }) {
  if (!user) return;
  const attempts = await incrementFailedAttempts(user.id);
  if (attempts >= env.security.maxFailedAttempts) {
    const lockedUntil = new Date(Date.now() + env.security.lockoutMinutes * 60 * 1000);
    await lockAccount(user.id, lockedUntil);
    await logEvent({ userId: user.id, eventType: 'user.account_locked', ipAddress, userAgent });
  }
}

export async function register({ username, password, ipAddress, userAgent }) {
  const passwordHash = await hashPassword(password);

  let user;
  try {
    user = await createUser({ username, passwordHash });
  } catch (err) {
    // Unique violation on the username column.
    if (err.code === '23505') {
      throw httpError(409, 'Username already taken.');
    }
    throw err;
  }

  await logEvent({ userId: user.id, eventType: 'user.registered', ipAddress, userAgent });
  return toPublicUser(user);
}

export async function login({ username, password, totpCode, ipAddress, userAgent }) {
  const user = await findByUsername(username);

  // Reject early while the account is locked, without revealing whether the
  // password was correct.
  if (isLocked(user)) {
    await logEvent({ userId: user.id, eventType: 'user.login_locked', ipAddress, userAgent });
    throw httpError(423, 'Account temporarily locked. Please try again later.');
  }

  const passwordOk = user && (await verifyPassword(user.password_hash, password));

  if (!passwordOk) {
    await registerFailedAttempt({ user, ipAddress, userAgent });
    await logEvent({
      userId: user?.id || null,
      eventType: 'user.login_failed',
      ipAddress,
      userAgent,
      metadata: { username },
    });
    // Same response whether the user exists or not, to avoid enumeration.
    throw httpError(401, 'Invalid credentials.');
  }

  if (user.totp_enabled) {
    if (!totpCode) {
      throw httpError(401, 'TOTP code required.');
    }
    if (!verifyToken(user.totp_secret, totpCode)) {
      await registerFailedAttempt({ user, ipAddress, userAgent });
      await logEvent({ userId: user.id, eventType: 'user.login_failed', ipAddress, userAgent });
      throw httpError(401, 'Invalid TOTP code.');
    }
  }

  // Successful login clears any earlier failed attempts and lockout.
  await resetFailedAttempts(user.id);

  const accessToken = signAccessToken(user);
  const refresh = await issueRefreshToken(user.id);

  await logEvent({ userId: user.id, eventType: 'user.login_success', ipAddress, userAgent });
  return { user: toPublicUser(user), accessToken, refreshToken: refresh.token };
}

export async function refresh({ refreshToken, ipAddress, userAgent }) {
  if (!refreshToken) {
    throw httpError(401, 'Missing refresh token.');
  }

  const stored = await findValidByHash(hashToken(refreshToken));
  if (!stored) {
    throw httpError(401, 'Invalid refresh token.');
  }

  // Rotation: the used token is revoked and replaced with a new one.
  await revokeById(stored.id);

  const user = await findById(stored.user_id);
  if (!user) {
    throw httpError(401, 'Invalid refresh token.');
  }

  const accessToken = signAccessToken(user);
  const newRefresh = await issueRefreshToken(user.id);

  await logEvent({ userId: user.id, eventType: 'token.refreshed', ipAddress, userAgent });
  return { accessToken, refreshToken: newRefresh.token };
}

export async function logout({ refreshToken, ipAddress, userAgent }) {
  if (!refreshToken) return;

  const stored = await findValidByHash(hashToken(refreshToken));
  if (stored) {
    await revokeById(stored.id);
    await logEvent({ userId: stored.user_id, eventType: 'user.logout', ipAddress, userAgent });
  }
}

export async function setupTwoFactor(userId) {
  const user = await findById(userId);
  if (!user) {
    throw httpError(404, 'User not found.');
  }

  // The secret is stored but 2FA stays disabled until the first code is verified.
  const secret = generateSecret();
  await setTotpSecret(userId, secret);
  return buildSetup(user.username, secret);
}

export async function enableTwoFactor({ userId, totpCode, ipAddress, userAgent }) {
  const user = await findById(userId);
  if (!user?.totp_secret) {
    throw httpError(400, 'Set up 2FA first.');
  }

  if (!verifyToken(user.totp_secret, totpCode)) {
    throw httpError(401, 'Invalid TOTP code.');
  }

  await enableTotp(userId);
  await logEvent({ userId, eventType: '2fa.enabled', ipAddress, userAgent });
}
