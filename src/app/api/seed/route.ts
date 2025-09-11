import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '../../../db/seed'

export async function POST(request: NextRequest) {
  try {
    // Basic auth check - only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Seeding only allowed in development' },
        { status: 403 }
      )
    }

    // Get auth header
    const auth = request.headers.get('authorization')
    if (auth !== 'Bearer seed-token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await seedDatabase()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    })
    
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
