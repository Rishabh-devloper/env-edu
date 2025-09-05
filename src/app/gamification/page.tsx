'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { usePoints } from '@/contexts/PointsContext'
import { useState } from 'react'
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Medal, 
  Zap,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Filter,
  Search
} from 'lucide-react'
import BadgeCard from '@/components/gamification/BadgeCard'
import Leaderboard from '@/components/gamification/Leaderboard'
import { Badge, Leaderboard as LeaderboardType, LeaderboardEntry } from '@/types'

export default function GamificationPage() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()
  const { totalPoints, level, badges } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'badges' | 'leaderboard' | 'points'>('badges')
  const [badgeFilter, setBadgeFilter] = useState<string>('all')
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>('class')

  // Mock data
  const mockBadges: Badge[] = [
    {
      id: '1',
      name: 'Eco Warrior',
      description: 'Complete your first environmental task',
      icon: '🌱',
      pointsRequired: 100,
      category: 'eco_action',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      icon: '📚',
      pointsRequired: 250,
      category: 'knowledge',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Community Leader',
      description: 'Help 10 other students',
      icon: '👥',
      pointsRequired: 500,
      category: 'leadership',
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Climate Champion',
      description: 'Earn 1000 eco-points',
      icon: '🏆',
      pointsRequired: 1000,
      category: 'community',
      rarity: 'legendary'
    },
    {
      id: '5',
      name: 'Recycling Master',
      description: 'Complete all recycling tasks',
      icon: '♻️',
      pointsRequired: 300,
      category: 'eco_action',
      rarity: 'rare'
    },
    {
      id: '6',
      name: 'Quiz Expert',
      description: 'Score 90%+ on 10 quizzes',
      icon: '🧠',
      pointsRequired: 400,
      category: 'knowledge',
      rarity: 'epic'
    }
  ]

  // Use context badges for earnedBadges, and mockBadges for display
  const earnedBadges = badges // from context
  const filteredBadges = mockBadges.filter(badge => {
    if (badgeFilter === 'all') return true
    return badge.category === badgeFilter
  })

  const leaderboards: { [key: string]: LeaderboardType } = {
    class: {
      id: 'class-1',
      type: 'class',
      scope: 'class-1',
      entries: [
        { userId: '1', userName: 'Alex Johnson', ecoPoints: 2150, level: 5, badges: 8, rank: 1, avatar: '' },
        { userId: '2', userName: 'Sarah Wilson', ecoPoints: 1890, level: 4, badges: 6, rank: 2, avatar: '' },
        { userId: '3', userName: 'Mike Chen', ecoPoints: 1650, level: 4, badges: 5, rank: 3, avatar: '' },
        { userId: '4', userName: 'Emma Davis', ecoPoints: 1420, level: 3, badges: 4, rank: 4, avatar: '' },
        { userId: '5', userName: 'You', ecoPoints: 1250, level: 3, badges: 3, rank: 5, avatar: '' }
      ],
      period: 'all_time',
      updatedAt: new Date()
    },
    school: {
      id: 'school-1',
      type: 'school',
      scope: 'school-1',
      entries: [
        { userId: '1', userName: 'Green Valley High', ecoPoints: 12500, level: 8, badges: 15, rank: 1, avatar: '' },
        { userId: '2', userName: 'Eco Academy', ecoPoints: 11200, level: 7, badges: 12, rank: 2, avatar: '' },
        { userId: '3', userName: 'Nature School', ecoPoints: 9800, level: 6, badges: 10, rank: 3, avatar: '' }
      ],
      period: 'all_time',
      updatedAt: new Date()
    },
    global: {
      id: 'global-1',
      type: 'global',
      scope: 'global',
      entries: [
        { userId: '1', userName: 'EcoMaster2024', ecoPoints: 25000, level: 10, badges: 25, rank: 1, avatar: '' },
        { userId: '2', userName: 'GreenWarrior', ecoPoints: 22000, level: 9, badges: 22, rank: 2, avatar: '' },
        { userId: '3', userName: 'ClimateHero', ecoPoints: 19500, level: 8, badges: 20, rank: 3, avatar: '' }
      ],
      period: 'all_time',
      updatedAt: new Date()
    }
  }

  const userStats = {
    totalPoints,
    level,
    badgesEarned: badges.length,
    rank: 5,
    weeklyPoints: 150,
    monthlyPoints: 450
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the gamification module.</p>
          <a href="/sign-in" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gamification Center</h1>
                <p className="text-gray-600">Earn points, unlock badges, and compete with others</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.totalPoints}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Level {userStats.level}</div>
                <div className="text-sm text-gray-500">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.badgesEarned}</div>
                <div className="text-sm text-gray-500">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'badges', label: 'Badges', icon: Award },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { id: 'points', label: 'Points', icon: Star }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Badges Tab */}
        {selectedTab === 'badges' && (
          <div>
            {/* Badge Filters */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'all', label: 'All Badges' },
                  { id: 'eco_action', label: 'Eco Action' },
                  { id: 'knowledge', label: 'Knowledge' },
                  { id: 'leadership', label: 'Leadership' },
                  { id: 'community', label: 'Community' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setBadgeFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      badgeFilter === filter.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={earnedBadges.includes(badge.id)}
                  earnedAt={earnedBadges.includes(badge.id) ? new Date() : undefined}
                  showProgress={!earnedBadges.includes(badge.id)}
                  progress={Math.min((userStats.totalPoints / badge.pointsRequired) * 100, 100)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div>
            {/* Leaderboard Filters */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'class', label: 'Class Leaderboard' },
                  { id: 'school', label: 'School Leaderboard' },
                  { id: 'global', label: 'Global Leaderboard' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setLeaderboardFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      leaderboardFilter === filter.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="max-w-4xl mx-auto">
              <Leaderboard
                leaderboard={leaderboards[leaderboardFilter]}
                currentUserId="5"
                onUserClick={(userId) => console.log('User clicked:', userId)}
              />
            </div>
          </div>
        )}

        {/* Points Tab */}
        {selectedTab === 'points' && (
          <div className="space-y-8">
            {/* Points Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Points Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{userStats.totalPoints}</div>
                  <div className="text-gray-500">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{userStats.weeklyPoints}</div>
                  <div className="text-gray-500">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{userStats.monthlyPoints}</div>
                  <div className="text-gray-500">This Month</div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
                <span className="text-sm text-gray-500">{userStats.totalPoints} / {(userStats.level + 1) * 500} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(userStats.totalPoints % 500) / 5}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {500 - (userStats.totalPoints % 500)} points until Level {userStats.level + 1}
              </p>
            </div>

            {/* Recent Points Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Completed "Climate Change Basics" lesson</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+50 points</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Earned "Eco Warrior" badge</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">+25 points</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Submitted "Plant a Tree" task</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">+100 points</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
