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

    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope') || 'global'
    const period = searchParams.get('period') || 'all_time'

    // Mock user rank data
    let rank = 15
    let totalParticipants = 1500
    
    switch (scope) {
      case 'school':
        rank = Math.floor(Math.random() * 10) + 5 // Rank 5-15 in school
        totalParticipants = 120
        break
      case 'class':
        rank = Math.floor(Math.random() * 5) + 2 // Rank 2-7 in class
        totalParticipants = 25
        break
      case 'global':
      default:
        rank = Math.floor(Math.random() * 50) + 10 // Rank 10-60 globally
        totalParticipants = 1500
        break
    }

    const percentile = Math.round((1 - (rank / totalParticipants)) * 100)

    // Mock nearby users
    const nearbyUsers = [
      {
        userId: 'user_nearby_1',
        userName: 'Student Above You',
        ecoPoints: 1650,
        level: 8,
        rank: rank - 1,
        avatar: null,
        school: 'Mock School',
        badges: 3
      },
      {
        userId: userId,
        userName: 'You',
        ecoPoints: 1520,
        level: 7,
        rank: rank,
        avatar: null,
        school: 'Your School',
        badges: 3
      },
      {
        userId: 'user_nearby_2',
        userName: 'Student Below You',
        ecoPoints: 1380,
        level: 7,
        rank: rank + 1,
        avatar: null,
        school: 'Mock School',
        badges: 2
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        rank,
        totalParticipants,
        percentile
      },
      rank,
      nearby: nearbyUsers
    })

  } catch (error) {
    console.error('Error fetching user rank:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user rank' }, 
      { status: 500 }
    )
  }
}
