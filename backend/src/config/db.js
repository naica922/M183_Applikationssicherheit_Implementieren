import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
});

// Always use parametrized queries to avoid SQL injection.
export function query(text, params) {
  return pool.query(text, params);
}

export async function assertDbConnection() {
  await pool.query('SELECT 1');
}
