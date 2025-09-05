import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Mock data - in production, this would come from a database
const userPoints = new Map<string, number>()

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const points = userPoints.get(userId) || 0

    return NextResponse.json({
      success: true,
      data: {
        userId,
        ecoPoints: points,
        level: Math.floor(points / 100) + 1,
        nextLevelPoints: ((Math.floor(points / 100) + 1) * 100) - points
      }
    })
  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { points, reason, activityId, activityType } = body

    if (!points || points <= 0) {
      return NextResponse.json(
        { error: 'Invalid points value' },
        { status: 400 }
      )
    }

    // Get current points
    const currentPoints = userPoints.get(userId) || 0
    const newPoints = currentPoints + points
    userPoints.set(userId, newPoints)

    // Check for level up
    const currentLevel = Math.floor(currentPoints / 100) + 1
    const newLevel = Math.floor(newPoints / 100) + 1
    const leveledUp = newLevel > currentLevel

    // Log the activity (in production, this would be stored in database)
    console.log(`User ${userId} earned ${points} points for ${reason} (${activityType}: ${activityId})`)

    return NextResponse.json({
      success: true,
      data: {
        userId,
        ecoPoints: newPoints,
        level: newLevel,
        pointsEarned: points,
        leveledUp,
        reason,
        activityId,
        activityType
      }
    })
  } catch (error) {
    console.error('Error adding points:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
