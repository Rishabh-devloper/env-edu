import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const allBadges = [
  {
    id: 'tree-planter',
    name: 'Tree Planter',
    description: 'Plant your first tree and contribute to reforestation',
    icon: '🌱',
    rarity: 'common',
    required: 1
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Complete 10 environmental tasks and make a difference',
    icon: '🛡️',
    rarity: 'rare',
    required: 10
  },
  {
    id: 'pollution-reporter',
    name: 'Pollution Reporter',
    description: 'Document 5 pollution incidents in your community',
    icon: '📸',
    rarity: 'common',
    required: 5
  },
  {
    id: 'energy-saver',
    name: 'Energy Saver',
    description: 'Complete 3 energy conservation tasks',
    icon: '⚡',
    rarity: 'uncommon',
    required: 3
  },
  {
    id: 'recycling-hero',
    name: 'Recycling Hero',
    description: 'Organize a successful recycling drive',
    icon: '♻️',
    rarity: 'rare',
    required: 1
  },
  {
    id: 'water-guardian',
    name: 'Water Guardian',
    description: 'Complete 5 water conservation activities',
    icon: '💧',
    rarity: 'uncommon',
    required: 5
  },
  {
    id: 'climate-champion',
    name: 'Climate Champion',
    description: 'Earn 1000 eco-points through various activities',
    icon: '🏆',
    rarity: 'epic',
    required: 1000
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Lead 3 community environmental initiatives',
    icon: '👥',
    rarity: 'legendary',
    required: 3
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    rarity: 'epic',
    required: 30
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    description: 'Score 100% on 10 environmental quizzes',
    icon: '🧠',
    rarity: 'rare',
    required: 10
  }
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // In production, you would fetch user's earned badges from database
    // For demo, we'll simulate some earned badges
    const earnedBadges = [
      {
        ...allBadges.find(b => b.id === 'tree-planter')!,
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        progress: 1
      },
      {
        ...allBadges.find(b => b.id === 'pollution-reporter')!,
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        progress: 5
      },
      {
        ...allBadges.find(b => b.id === 'energy-saver')!,
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        progress: 3
      }
    ]

    // Add progress to badges not yet earned
    const badgesWithProgress = allBadges.map(badge => {
      const earnedBadge = earnedBadges.find(eb => eb.id === badge.id)
      if (earnedBadge) {
        return earnedBadge
      }
      
      // Simulate progress towards badge
      let progress = 0
      switch (badge.id) {
        case 'eco-warrior':
          progress = Math.floor(Math.random() * 8) + 1 // 1-8 out of 10
          break
        case 'recycling-hero':
          progress = 0 // Not started
          break
        case 'water-guardian':
          progress = Math.floor(Math.random() * 3) + 1 // 1-3 out of 5
          break
        case 'climate-champion':
          progress = Math.floor(Math.random() * 800) + 200 // 200-1000 points
          break
        case 'streak-master':
          progress = Math.floor(Math.random() * 25) + 5 // 5-30 days
          break
        case 'quiz-champion':
          progress = Math.floor(Math.random() * 7) + 1 // 1-7 out of 10
          break
        default:
          progress = Math.floor(Math.random() * Math.floor(badge.required / 2))
      }

      return {
        ...badge,
        progress: Math.min(progress, badge.required)
      }
    })

    return NextResponse.json({
      success: true,
      allBadges: badgesWithProgress,
      earnedBadges: earnedBadges,
      totalBadges: allBadges.length,
      earnedCount: earnedBadges.length
    })

  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' }, 
      { status: 500 }
    )
  }
}
