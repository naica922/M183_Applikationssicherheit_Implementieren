import pg from 'pg';
import { env } from './env.js';

// Ein gemeinsamer Connection-Pool fuer die ganze App.
export const pool = new pg.Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
});

// Kleiner Helper, damit Queries ueberall gleich laufen (parametrisiert -> Schutz vor SQL-Injection).
export function query(text, params) {
  return pool.query(text, params);
}

// Prueft beim Start, ob die DB erreichbar ist.
export async function assertDbConnection() {
  await pool.query('SELECT 1');
}
