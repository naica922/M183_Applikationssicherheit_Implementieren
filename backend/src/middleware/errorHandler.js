import { env } from '../config/env.js';

// 404-Handler fuer unbekannte Routen.
export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

// Zentraler Fehler-Handler. Gibt nach aussen keine internen Details preis.
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // Details nur im Log, nicht in der Response (keine Stacktraces an den Client).
  console.error(err);

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    ...(env.nodeEnv === 'development' && status === 500 ? { detail: err.message } : {}),
  });
}
