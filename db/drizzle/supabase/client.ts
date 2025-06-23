import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.EXPO_PUBLIC_SUPABASE_URL || ""

export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)
