import { createUser, findByUsername } from '../repositories/userRepository.js';
import { logEvent } from '../repositories/auditRepository.js';
import { hashPassword, verifyPassword } from './passwordService.js';
import { signAccessToken, issueRefreshToken } from './tokenService.js';
import { toPublicUser } from '../models/user.js';
import { httpError } from '../utils/httpError.js';

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

export async function login({ username, password, ipAddress, userAgent }) {
  const user = await findByUsername(username);
  const passwordOk = user && (await verifyPassword(user.password_hash, password));

  if (!passwordOk) {
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

  const accessToken = signAccessToken(user);
  const refresh = await issueRefreshToken(user.id);

  await logEvent({ userId: user.id, eventType: 'user.login_success', ipAddress, userAgent });
  return { user: toPublicUser(user), accessToken, refreshToken: refresh.token };
}
