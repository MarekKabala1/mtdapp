import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/drizzle/sqlite/schema.ts',
  out: './db/drizzle/sqlite/migration',
});
