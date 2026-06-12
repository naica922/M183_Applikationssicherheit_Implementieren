import { createApp } from './app.js';
import { env } from './config/env.js';
import { assertDbConnection, pool } from './config/db.js';

async function start() {
  try {
    await assertDbConnection();
    console.log('Database connection ok.');
  } catch (err) {
    console.error('No database connection. Is PostgreSQL running and is the .env correct?');
    console.error(err.message);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`SecurePass backend running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async () => {
    server.close();
    await pool.end();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
