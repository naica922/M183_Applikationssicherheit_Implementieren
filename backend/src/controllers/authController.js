import { validateRegister } from '../validators/authValidator.js';
import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { valid, errors, value } = validateRegister(req.body);
    if (!valid) {
      return res.status(400).json({ errors });
    }

    const user = await authService.register({
      username: value.username,
      password: value.password,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}
