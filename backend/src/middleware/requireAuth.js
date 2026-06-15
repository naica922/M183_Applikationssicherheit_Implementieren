import { verifyAccessToken } from '../services/tokenService.js';
import { httpError } from '../utils/httpError.js';

// Verifies the Bearer access token and attaches the user to the request.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(httpError(401, 'Authentication required.'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    next(httpError(401, 'Invalid or expired token.'));
  }
}
