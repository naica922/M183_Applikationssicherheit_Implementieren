import { createUser } from '../repositories/userRepository.js';
import { logEvent } from '../repositories/auditRepository.js';
import { hashPassword } from './passwordService.js';
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
