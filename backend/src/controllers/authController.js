import { validateRegister, validateLogin } from '../validators/authValidator.js';
import * as authService from '../services/authService.js';
import { env } from '../config/env.js';
import { issueCsrfToken, clearCsrfToken } from '../middleware/csrf.js';

const REFRESH_COOKIE_PATH = '/api/auth';

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
    maxAge: env.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', { path: REFRESH_COOKIE_PATH });
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
      totpCode: req.body?.totpCode,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    setRefreshCookie(res, refreshToken);
    issueCsrfToken(res);
    res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.refresh({
      refreshToken: req.cookies?.refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    setRefreshCookie(res, refreshToken);
    issueCsrfToken(res);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout({
      refreshToken: req.cookies?.refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    clearRefreshCookie(res);
    clearCsrfToken(res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function setupTwoFactor(req, res, next) {
  try {
    const setup = await authService.setupTwoFactor(req.user.id);
    res.json(setup);
  } catch (err) {
    next(err);
  }
}

export async function enableTwoFactor(req, res, next) {
  try {
    if (!req.body?.totpCode) {
      return res.status(400).json({ error: 'TOTP code is required.' });
    }

    await authService.enableTwoFactor({
      userId: req.user.id,
      totpCode: req.body.totpCode,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    res.json({ message: '2FA enabled.' });
  } catch (err) {
    next(err);
  }
}
