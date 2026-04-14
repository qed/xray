/**
 * Apply any pending migration file by running it against the Supabase database.
 *
 * Usage:
 *   npx tsx scripts/apply-migration.ts 021_org_wide_read_access.sql
 *
 * Requires DATABASE_URL in .env.local (Supabase → Settings → Database →
 * Connection string → URI, with your DB password filled in).
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import { Client } from 'pg';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npx tsx scripts/apply-migration.ts <migration-file.sql>');
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not set. Add it to .env.local.');
    console.error('Get it from: Supabase → Settings → Database → Connection string → URI');
    process.exit(1);
  }

  const path = resolve(process.cwd(), 'supabase/migrations', file);
  const sql = readFileSync(path, 'utf8');
  console.log(`Applying ${file} (${sql.length} chars)...`);

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration applied successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
