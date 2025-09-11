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

    // Get top users from database
    const result = await db.query(`
      SELECT 
        up.user_id,
        up.total_points,
        up.level,
        up.badges_earned,
        ROW_NUMBER() OVER (ORDER BY up.total_points DESC, up.badges_earned DESC) as position
      FROM user_progress_enhanced up
      WHERE up.total_points > 0
      ORDER BY up.total_points DESC, up.badges_earned DESC
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
    console.error('Error in /api/leaderboard/global:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
