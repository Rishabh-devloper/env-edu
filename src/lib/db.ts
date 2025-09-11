import 'server-only'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// Create a direct SQL connection for the badge system
// This provides a simple query interface that works with our PostgreSQL queries
const sql = neon(process.env.DATABASE_URL)

interface QueryResult {
  rows: any[]
  rowCount?: number
}

export const db = {
  async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      // Use the new Neon query format with parameters
      const result = params && params.length > 0 
        ? await sql.query(text, params)
        : await sql.query(text)
      
      return {
        rows: Array.isArray(result.rows) ? result.rows : [result.rows],
        rowCount: result.rowCount || (Array.isArray(result.rows) ? result.rows.length : 1)
      }
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }
}

export default db
