import { NextRequest, NextResponse } from 'next/server'
import { getAllBadges, getUserBadges, checkBadgeEligibility, addBadge } from '@/db/actions/badges'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const badgeId = searchParams.get('badgeId')
    const userId = searchParams.get('userId')

    // Handle different actions
    switch (action) {
      case 'all':
        // Get all available badges
        const allBadges = await getAllBadges()
        return NextResponse.json({ badges: allBadges })

      case 'user':
        // Get user's earned badges
        const userBadges = await getUserBadges(userId || undefined)
        return NextResponse.json({ badges: userBadges })

      case 'check':
        // Check eligibility for a specific badge
        if (!badgeId) {
          return NextResponse.json({ error: 'Badge ID is required' }, { status: 400 })
        }
        const eligibility = await checkBadgeEligibility(badgeId)
        return NextResponse.json(eligibility)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Badge API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { badgeId, points } = body

    if (!badgeId) {
      return NextResponse.json({ error: 'Badge ID is required' }, { status: 400 })
    }

    const result = await addBadge(badgeId, points)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Badge API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}