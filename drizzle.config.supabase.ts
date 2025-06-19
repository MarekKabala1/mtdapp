import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/drizzle/supabase/schema.ts',
  out: './db/drizzle/supabase/migration',
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  }
});