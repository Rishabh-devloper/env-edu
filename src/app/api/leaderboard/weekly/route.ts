import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  totalPoints: number
  level: number
  badgesEarned: number
  position: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    // Get weekly points from activity feed (last 7 days)
    const result = await db.query(`
      WITH weekly_points AS (
        SELECT 
          af.user_id,
          SUM(af.points_earned) as weekly_points
        FROM activity_feed af
        WHERE af.created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY af.user_id
      ),
      weekly_leaderboard AS (
        SELECT 
          wp.user_id,
          wp.weekly_points as total_points,
          up.level,
          up.badges_earned,
          ROW_NUMBER() OVER (ORDER BY wp.weekly_points DESC) as position
        FROM weekly_points wp
        JOIN user_progress_enhanced up ON wp.user_id = up.user_id
        WHERE wp.weekly_points > 0
      )
      SELECT * FROM weekly_leaderboard
      ORDER BY total_points DESC
      LIMIT $1
    `, [limit])

    const leaderboard: LeaderboardEntry[] = []

    // Fetch user details from Clerk for each entry
    for (const row of result.rows) {
      try {
        const user = await clerkClient.users.getUser(row.user_id)
        
        leaderboard.push({
          userId: row.user_id,
          username: user.username || user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Anonymous',
          avatar: user.imageUrl,
          totalPoints: parseInt(row.total_points),
          level: parseInt(row.level),
          badgesEarned: parseInt(row.badges_earned),
          position: parseInt(row.position)
        })
      } catch (userError) {
        // If we can't fetch user data, skip this entry
        console.warn(`Could not fetch user data for ${row.user_id}:`, userError)
      }
    }

    return NextResponse.json(leaderboard)

  } catch (error) {
    console.error('Error in /api/leaderboard/weekly:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
