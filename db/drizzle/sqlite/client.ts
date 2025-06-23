import { drizzle } from "drizzle-orm/expo-sqlite"
import * as SQLite from "expo-sqlite"

export const openMtdDb = SQLite.openDatabaseSync("mtd.db")

export const db = drizzle(openMtdDb)
