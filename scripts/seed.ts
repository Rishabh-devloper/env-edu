#!/usr/bin/env tsx

import { seedDatabase } from '../src/db/seed'

async function main() {
  try {
    await seedDatabase()
    console.log('✅ Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
