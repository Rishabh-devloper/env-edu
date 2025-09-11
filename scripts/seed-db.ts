#!/usr/bin/env tsx

import { seedDatabase } from '../src/db/seed'
import { db } from '../src/db'
import { sql } from 'drizzle-orm'

async function main() {
  console.log('🌱 Environmental Education Database Seeding Script')
  console.log('================================================')

  try {
    // Test database connection
    console.log('🔗 Testing database connection...')
    await db.execute(sql`SELECT 1`)
    console.log('✅ Database connection successful')

    // Run seeding
    await seedDatabase()

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\nSeeded content includes:')
    console.log('- 13 Environmental badges across different categories')
    console.log('- 13 Environmental tasks (Tree planting, Waste management, Energy & Water conservation)')
    console.log('- 5 Educational lessons on key environmental topics')
    console.log('- 5 Sample schools across different Indian cities')
    console.log('\n✨ Your environmental education platform is ready to test!')

    process.exit(0)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    console.log('\nTroubleshooting tips:')
    console.log('- Check if your Neon database is accessible')
    console.log('- Verify your DATABASE_URL environment variable')
    console.log('- Ensure your database schema is up to date (run: npm run db:push)')
    
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Seeding interrupted by user')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n👋 Seeding terminated')
  process.exit(0)
})

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
