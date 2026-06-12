import { env } from '../config/env.js';

export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

// Central error handler: never leak internals to the client.
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  console.error(err);

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    ...(env.nodeEnv === 'development' && status === 500 ? { detail: err.message } : {}),
  });
}
