import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import BadgeSystem from '@/lib/badge-system'

export async function GET(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth()
    const { searchParams } = new URL(request.url)
    const queryUserId = searchParams.get('userId') || authUserId

    if (!queryUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Ensure user can only access their own data or is admin
    if (authUserId !== queryUserId && !isAdmin(authUserId)) {
      return NextResponse.json(
        { error: 'Forbidden' }, 
        { status: 403 }
      )
    }

    // Get user's earned badges
    const userBadges = await BadgeSystem.getUserBadges(queryUserId)
    
    return NextResponse.json(userBadges)

  } catch (error) {
    console.error('Error in /api/user/badges:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Helper function to check if user is admin
function isAdmin(userId: string | null): boolean {
  // Add your admin logic here
  return false
}
