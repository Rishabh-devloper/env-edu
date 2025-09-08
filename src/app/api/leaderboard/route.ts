import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/db/actions/analytics'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const scope = searchParams.get('scope') || 'global'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get leaderboard data
    const leaderboard = await getLeaderboard(scope as 'class' | 'school' | 'global', limit)
    
    return NextResponse.json({
      success: true,
      data: leaderboard
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}