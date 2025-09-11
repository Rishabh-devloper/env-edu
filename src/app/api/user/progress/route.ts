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

    // Get user progress from database
    const userProgress = await BadgeSystem.getUserProgress(queryUserId)
    
    if (!userProgress) {
      return NextResponse.json(
        { error: 'User progress not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(userProgress)

  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth()
    
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, activityType, data } = body

    // Ensure user can only update their own data or is admin
    if (authUserId !== userId && !isAdmin(authUserId)) {
      return NextResponse.json(
        { error: 'Forbidden' }, 
        { status: 403 }
      )
    }

    if (!activityType || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Validate activity type
    const validActivityTypes = ['lesson', 'quiz', 'task', 'social']
    if (!validActivityTypes.includes(activityType)) {
      return NextResponse.json(
        { error: 'Invalid activity type' }, 
        { status: 400 }
      )
    }

    // Update user progress using badge system
    await BadgeSystem.updateUserProgress(userId, activityType, data)

    // Get updated progress
    const updatedProgress = await BadgeSystem.getUserProgress(userId)

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      message: 'Progress updated successfully'
    })

  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' }, 
      { status: 500 }
    )
  }
}

// Helper function to check if user is admin
function isAdmin(userId: string | null): boolean {
  // Add your admin logic here
  return false
}
