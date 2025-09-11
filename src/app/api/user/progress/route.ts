import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // In a real implementation, you would fetch from database
    // For demo purposes, we'll return mock user progress data
    const mockProgress = {
      totalPoints: Math.floor(Math.random() * 2000) + 500, // Random points between 500-2500
      level: Math.floor(Math.random() * 10) + 5, // Level 5-15
      completedLessons: Array.from({length: Math.floor(Math.random() * 20) + 5}, (_, i) => `lesson_${i + 1}`),
      completedTasks: Array.from({length: Math.floor(Math.random() * 8) + 2}, (_, i) => `${i + 1}`),
      badges: ['tree-planter', 'eco-warrior', 'pollution-reporter'],
      totalLessons: 25,
      streak: Math.floor(Math.random() * 15) + 1, // 1-15 day streak
      completionRate: Math.floor(Math.random() * 60) + 20, // 20-80% completion
      nextLevelPoints: 2000,
      rank: Math.floor(Math.random() * 100) + 1, // Global rank 1-100
      schoolRank: Math.floor(Math.random() * 20) + 1 // School rank 1-20
    }

    return NextResponse.json({
      success: true,
      progress: mockProgress
    })

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
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, points, reason, lessonId, badgeId } = body

    // Handle different progress update actions
    switch (action) {
      case 'update_points':
        // In production: update user points in database
        console.log(`Adding ${points} points to user ${userId} for: ${reason}`)
        
        return NextResponse.json({
          success: true,
          message: `Added ${points} points!`,
          data: {
            totalPoints: points + 1500, // Mock calculation
            level: Math.floor((points + 1500) / 100) + 1,
            leveledUp: false // You would calculate this based on previous level
          }
        })

      case 'complete_lesson':
        // In production: mark lesson as completed and update progress
        console.log(`User ${userId} completed lesson: ${lessonId}`)
        
        return NextResponse.json({
          success: true,
          message: 'Lesson completed!',
          data: {
            totalPoints: points + 1500,
            level: Math.floor((points + 1500) / 100) + 1,
            completedLessons: ['lesson_1', 'lesson_2', lessonId], // Mock data
            completionRate: 75,
            leveledUp: false
          }
        })

      case 'add_badge':
        // In production: add badge to user profile
        console.log(`User ${userId} earned badge: ${badgeId}`)
        
        return NextResponse.json({
          success: true,
          message: 'Badge earned!',
          data: {
            badges: ['tree-planter', 'eco-warrior', badgeId]
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' }, 
      { status: 500 }
    )
  }
}
