import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Behind a reverse proxy in production, trust it so req.ip and req.secure
  // reflect the original client (needed for rate limiting and HTTPS checks).
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Secure HTTP headers. This is a JSON API, so the CSP locks everything down;
  // HSTS forces HTTPS once seen over a secure connection.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'none'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      hsts: { maxAge: 15552000, includeSubDomains: true },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  // HTTPS-only in production: redirect any plain-HTTP request to HTTPS.
  if (env.nodeEnv === 'production') {
    app.use((req, res, next) => {
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    });
  }

  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
