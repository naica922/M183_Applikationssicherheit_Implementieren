import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

const CSRF_COOKIE = 'csrfToken';

// Double-submit cookie pattern for the cookie-authenticated endpoints
// (refresh/logout). The token is stored in a JS-readable cookie and must be
// echoed back in the X-CSRF-Token header. A cross-site attacker cannot read the
// cookie, so it cannot produce the matching header. This complements the
// SameSite=strict attribute on the refresh cookie (defense in depth).

export function issueCsrfToken(res) {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
  });
  return token;
}

export function clearCsrfToken(res) {
  res.clearCookie(CSRF_COOKIE, { path: '/' });
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function requireCsrf(req, res, next) {
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    return next(httpError(403, 'Invalid or missing CSRF token.'));
  }
  next();
}
