import { createApp } from './app.js';
import { env } from './config/env.js';
import { assertDbConnection, pool } from './config/db.js';

async function start() {
  // DB-Verbindung pruefen, bevor wir den Port oeffnen.
  try {
    await assertDbConnection();
    console.log('DB-Verbindung ok.');
  } catch (err) {
    console.error('Keine DB-Verbindung. Laeuft PostgreSQL und stimmt die .env?');
    console.error(err.message);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`SecurePass-Backend laeuft auf http://localhost:${env.port} (${env.nodeEnv})`);
  });

  // Sauberes Herunterfahren.
  const shutdown = async () => {
    console.log('\nServer wird beendet ...');
    server.close();
    await pool.end();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
