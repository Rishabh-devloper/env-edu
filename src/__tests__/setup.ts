import { beforeAll, afterAll } from 'vitest'
import { config } from 'dotenv'
import { seedDatabase, badgesSeedData } from '../db/seed'

// Load environment variables for testing
config({ path: '.env.local' })

beforeAll(async () => {
  console.log('🧪 Setting up test environment...')
  
  // Ensure we have badges for testing
  try {
    await seedDatabase()
    console.log('✅ Test data seeded successfully')
  } catch (error) {
    console.log('⚠️ Seeding failed or data already exists:', error)
    // This is okay - data might already exist
  }
  
  console.log('🧪 Test environment ready')
})

afterAll(async () => {
  console.log('🧪 Cleaning up test environment...')
  // Add any global cleanup if needed
  console.log('✅ Test cleanup completed')
})
