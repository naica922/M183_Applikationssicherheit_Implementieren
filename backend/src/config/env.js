import dotenv from 'dotenv';

dotenv.config();

// Pflicht-Variablen, ohne die der Server nicht sauber startet.
const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail-fast: lieber beim Start abbrechen als zur Laufzeit ueberraschen.
  console.error(`Fehlende Umgebungsvariablen: ${missing.join(', ')}`);
  console.error('Lege eine .env an (siehe .env.example).');
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
};
