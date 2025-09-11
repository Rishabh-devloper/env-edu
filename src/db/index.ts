import 'server-only'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// Fix the connection string by properly encoding it
const connectionString = process.env.DATABASE_URL.replace(/\?(.*)$/, (match) => {
  // Keep the question mark but encode the query parameters
  return '?' + match.substring(1).replace(/&/g, '%26')
})

const sql = neon(connectionString)
export const db = drizzle(sql, { schema })
export type DbClient = typeof db


