import dotenv from 'dotenv';

dotenv.config();

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];
const missing = required.filter((key) => !process.env[key]);

// Fail fast on missing config instead of breaking at runtime.
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  console.error('Create a .env file (see .env.example).');
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS) || 7,
  },
};
