import { NextRequest, NextResponse } from 'next/server'
import { getUserStats as getUserStatsAnalytics } from '@/db/actions/analytics'
import { getProgress as getProgressState, addPoints as addPointsState, completeLesson as completeLessonState, getCompletedLessons, ensureUserRecord } from '@/db/actions/progress'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    // Ensure user record exists
    await ensureUserRecord()

    // Get user progress
    const progress = await getProgressState()
    if (!progress) {
      return NextResponse.json({ 
        success: false, 
        error: 'User progress not found' 
      }, { status: 404 })
    }
    
    // Get user stats
    const stats = await getUserStatsAnalytics(userId || undefined)
    const completedLessonsIds = await getCompletedLessons()
    
    // Calculate completion rate and next level points
    const totalLessons = 15 // This could come from a database count
    const completionRate = stats?.completedLessons
      ? Math.round((stats.completedLessons / totalLessons) * 100)
      : 0
    
    const nextLevelPoints = (progress.level * 100) - (progress.totalPoints % 100)

    return NextResponse.json({
      success: true,
      data: {
        ...progress,
        completedLessons: completedLessonsIds,
        completedLessonsCount: stats?.completedLessons || 0,
        totalLessons,
        completionRate,
        nextLevelPoints,
        pointsByActivity: stats?.pointsByActivity || {}
      }
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { points, reason, activityType, activityId, lessonId } = body

    if (!points) {
      return NextResponse.json(
        { success: false, error: 'Points are required' },
        { status: 400 }
      )
    }

    // Handle lesson completion
    if (lessonId) {
      const result = await completeLessonState(lessonId, points)
      const completedLessonsIds = await getCompletedLessons()
      const totalLessons = 15
      const completionRate = Math.round(((result.completedLessonsCount || 0) / totalLessons) * 100)

      return NextResponse.json({
        success: true,
        data: {
          totalPoints: result.totalPoints,
          level: result.level,
          completedLessons: completedLessonsIds,
          completionRate,
          leveledUp: result.levelUp,
        }
      })
    }
    
    // Handle general points addition
    const result = await addPointsState(points, reason, { type: activityType, id: activityId })
    
    return NextResponse.json({
      success: true,
      totalPoints: result.totalPoints,
      level: result.level,
      leveledUp: result.levelUp
    })
  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
