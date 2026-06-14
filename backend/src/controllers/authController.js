import { validateRegister, validateLogin } from '../validators/authValidator.js';
import * as authService from '../services/authService.js';
import { env } from '../config/env.js';

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: env.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
}

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

export async function login(req, res, next) {
  try {
    const { valid, value } = validateLogin(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const { user, accessToken, refreshToken } = await authService.login({
      username: value.username,
      password: value.password,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}
