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

  // Sichere HTTP-Header (OWASP A05: Security Misconfiguration).
  app.use(helmet());

  // CORS nur fuer das eigene Frontend, mit Credentials (Cookies).
  app.use(cors({ origin: env.corsOrigin, credentials: true }));

  // Body- und Cookie-Parser. Body-Groesse begrenzen.
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  // Globales Rate Limiting als Grundschutz (feinere Limits spaeter pro Route).
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // API-Routen.
  app.use('/api', routes);

  // 404 + zentraler Fehler-Handler ganz am Schluss.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
