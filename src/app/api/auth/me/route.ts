import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * GET /api/auth/me
 * Get current user's role and metadata
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    
    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.privateMetadata?.role || 'student',
        roleAssigned: user.publicMetadata?.roleAssigned || false,
        assignedAt: user.publicMetadata?.assignedAt || null,
        lastUpdated: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Error getting user data:', error)
    return NextResponse.json(
      { error: 'Failed to get user data', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
