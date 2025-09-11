import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const mockUsers = [
  {
    id: 'user_1',
    name: 'Arjun Sharma',
    avatar: null,
    points: 2450,
    level: 12,
    rank: 1,
    badge: '🏆',
    school: 'Delhi Public School',
    class: '10-A'
  },
  {
    id: 'user_2', 
    name: 'Priya Patel',
    avatar: null,
    points: 2180,
    level: 11,
    rank: 2,
    badge: '🛡️',
    school: 'Kendriya Vidyalaya',
    class: '10-B'
  },
  {
    id: 'user_3',
    name: 'Rohit Singh',
    avatar: null,
    points: 1875,
    level: 9,
    rank: 3,
    badge: '🌱',
    school: 'St. Mary\'s High School',
    class: '9-A'
  },
  {
    id: 'user_4',
    name: 'Ananya Gupta',
    avatar: null,
    points: 1645,
    level: 8,
    rank: 4,
    badge: '♻️',
    school: 'DAV Public School',
    class: '10-C'
  },
  {
    id: 'user_5',
    name: 'Vikram Reddy',
    avatar: null,
    points: 1520,
    level: 8,
    rank: 5,
    badge: '📸',
    school: 'Narayana High School',
    class: '9-B'
  },
  {
    id: 'user_6',
    name: 'Meera Joshi',
    avatar: null,
    points: 1380,
    level: 7,
    rank: 6,
    badge: '💧',
    school: 'Modern School',
    class: '10-A'
  },
  {
    id: 'user_7',
    name: 'Karan Malhotra',
    avatar: null,
    points: 1245,
    level: 7,
    rank: 7,
    badge: '⚡',
    school: 'Ryan International',
    class: '9-C'
  },
  {
    id: 'user_8',
    name: 'Sanya Kapoor',
    avatar: null,
    points: 1120,
    level: 6,
    rank: 8,
    badge: '🌱',
    school: 'Amity International',
    class: '10-B'
  },
  {
    id: 'user_9',
    name: 'Aditya Agarwal',
    avatar: null,
    points: 980,
    level: 6,
    rank: 9,
    badge: '🔥',
    school: 'DPS Ghaziabad',
    class: '9-A'
  },
  {
    id: 'user_10',
    name: 'Ishita Bansal',
    avatar: null,
    points: 875,
    level: 5,
    rank: 10,
    badge: '🧠',
    school: 'Lotus Valley School',
    class: '10-D'
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global'
    const limit = parseInt(searchParams.get('limit') || '10')

    let leaderboardData = [...mockUsers]
    let userRank = Math.floor(Math.random() * 50) + 10 // Random rank between 10-60

    // Filter based on leaderboard type
    switch (type) {
      case 'school':
        // In production, filter by user's school
        leaderboardData = mockUsers.filter(user => 
          user.school === 'Delhi Public School' || 
          user.school === 'Kendriya Vidyalaya'
        )
        userRank = Math.floor(Math.random() * 5) + 3 // Rank 3-7 in school
        break
        
      case 'class':
        // In production, filter by user's class
        leaderboardData = mockUsers.filter(user => 
          user.class === '10-A'
        ).slice(0, 5)
        userRank = Math.floor(Math.random() * 3) + 2 // Rank 2-4 in class
        break
        
      case 'global':
      default:
        // Global leaderboard - use all users
        break
    }

    // Limit results
    leaderboardData = leaderboardData.slice(0, limit)

    // Add current user to leaderboard if not in top results
    const currentUserInTop = leaderboardData.find(user => user.id === userId)
    
    if (!currentUserInTop && userRank <= 100) {
      // Add current user entry
      const currentUserProgress = Math.floor(Math.random() * 1000) + 800 // 800-1800 points
      const currentUser = {
        id: userId,
        name: 'You',
        avatar: null,
        points: currentUserProgress,
        level: Math.floor(currentUserProgress / 100) + 1,
        rank: userRank,
        badge: '🌱',
        school: 'Your School',
        class: '10-A'
      }

      // Insert at appropriate position or add to end
      if (userRank <= leaderboardData.length + 1) {
        leaderboardData.splice(userRank - 1, 0, currentUser)
      }
    }

    // Transform to expected structure
    const transformedLeaderboard = {
      id: `${type}-leaderboard`,
      type: type,
      scope: type,
      entries: leaderboardData.map(user => ({
        userId: user.id,
        userName: user.name,
        ecoPoints: user.points,
        level: user.level,
        rank: user.rank,
        avatar: user.avatar,
        school: user.school,
        badges: 1 // Mock badge count
      })),
      period: 'all_time',
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: transformedLeaderboard.entries,
      userRank: userRank,
      totalUsers: type === 'global' ? 1500 : type === 'school' ? 120 : 25,
      leaderboardType: type
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' }, 
      { status: 500 }
    )
  }
}
