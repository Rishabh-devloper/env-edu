import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import BadgeSystem from '@/lib/badge-system'

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
    const { badgeId } = body

    if (!badgeId) {
      return NextResponse.json(
        { error: 'Badge ID is required' }, 
        { status: 400 }
      )
    }

    // Get badge details
    const badge = await BadgeSystem.getBadgeById(badgeId)
    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' }, 
        { status: 404 }
      )
    }

    // Check if user already has this badge
    const userBadges = await BadgeSystem.getUserBadges(userId)
    const alreadyEarned = userBadges.some(b => b.badgeId === badgeId)
    
    if (alreadyEarned) {
      return NextResponse.json(
        { error: 'Badge already earned' }, 
        { status: 400 }
      )
    }

    // Award the badge
    const newBadges = await BadgeSystem.checkAndAwardBadges(userId, 'manual')
    const earnedBadge = newBadges.find(b => b.badgeId === badgeId)

    if (earnedBadge) {
      return NextResponse.json({
        success: true,
        badge: {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          earnedAt: earnedBadge.earnedAt
        },
        message: `Badge "${badge.name}" earned!`
      })
    } else {
      return NextResponse.json(
        { error: 'Badge requirements not met' }, 
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error earning badge:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to earn badge'
      }, 
      { status: 500 }
    )
  }
}
