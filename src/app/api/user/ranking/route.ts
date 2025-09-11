import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

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

    // Get global ranking
    const globalRankResult = await db.query(`
      WITH ranked_users AS (
        SELECT 
          user_id,
          total_points,
          ROW_NUMBER() OVER (ORDER BY total_points DESC, badges_earned DESC) as rank
        FROM user_progress_enhanced
        WHERE total_points > 0
      ),
      total_users AS (
        SELECT COUNT(*) as total_count
        FROM user_progress_enhanced
        WHERE total_points > 0
      )
      SELECT 
        ru.rank as global_rank,
        tu.total_count,
        (100.0 - (ru.rank * 100.0 / tu.total_count)) as percentile
      FROM ranked_users ru, total_users tu
      WHERE ru.user_id = $1
    `, [queryUserId])

    // Get weekly ranking
    const weeklyRankResult = await db.query(`
      WITH weekly_points AS (
        SELECT 
          af.user_id,
          SUM(af.points_earned) as weekly_points
        FROM activity_feed af
        WHERE af.created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY af.user_id
      ),
      ranked_weekly AS (
        SELECT 
          user_id,
          weekly_points,
          ROW_NUMBER() OVER (ORDER BY weekly_points DESC) as rank
        FROM weekly_points
        WHERE weekly_points > 0
      )
      SELECT rank as weekly_rank
      FROM ranked_weekly
      WHERE user_id = $1
    `, [queryUserId])

    const globalData = globalRankResult.rows[0]
    const weeklyData = weeklyRankResult.rows[0]

    const ranking = {
      global: globalData ? parseInt(globalData.global_rank) : 0,
      weekly: weeklyData ? parseInt(weeklyData.weekly_rank) : 0,
      percentile: globalData ? parseFloat(globalData.percentile) : 0
    }

    return NextResponse.json(ranking)

  } catch (error) {
    console.error('Error in /api/user/ranking:', error)
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
