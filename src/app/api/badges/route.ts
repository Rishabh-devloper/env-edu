import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import BadgeSystem from '@/lib/badge-system'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Get all available badges from database
    const badges = await BadgeSystem.getAllBadges()
    
    return NextResponse.json(badges)

  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' }, 
      { status: 500 }
    )
  }
}
