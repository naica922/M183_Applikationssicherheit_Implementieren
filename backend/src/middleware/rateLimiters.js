import rateLimit from 'express-rate-limit';

// Tight limiter for authentication endpoints to slow down brute-force and
// credential-stuffing attempts. The global limiter in app.js stays in place
// as a coarse safety net for the rest of the API.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});
