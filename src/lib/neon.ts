import { Pool } from 'pg';

let pool: Pool | null = null;

export const isNeonConfigured = Boolean(
  process.env.DATABASE_URL || 
  process.env.DATABASE_URL_UNPOOLED || 
  process.env.POSTGRES_URL
);

export function getNeonPool(): Pool | null {
  if (!isNeonConfigured) return null;
  
  if (!pool) {
    const connectionString = 
      process.env.DATABASE_URL || 
      process.env.DATABASE_URL_UNPOOLED || 
      process.env.POSTGRES_URL;

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  return pool;
}

export async function queryNeon(text: string, params?: any[]) {
  const p = getNeonPool();
  if (!p) throw new Error('Neon Database connection string is not configured.');
  return p.query(text, params);
}
