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
import { useEnhancedBadges, useEnhancedLeaderboard } from '@/hooks/useEnhancedData'
import Link from 'next/link'

export default function GamificationPage() {
  const { isSignedIn, user } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()
  const { totalPoints, level, badges } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'badges' | 'leaderboard' | 'points'>('badges')
  const [badgeFilter, setBadgeFilter] = useState<string>('all')
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>('class')
  
  // Use enhanced data hooks with fallback data
  const {
    allBadges,
    userBadges: userBadgesList,
    loading: badgesLoading,
    error: badgesError
  } = useEnhancedBadges()

  const {
    leaderboard,
    userRank,
    loading: leaderboardLoading,
    error: leaderboardError
  } = useEnhancedLeaderboard('all_time', leaderboardFilter as 'global' | 'school' | 'class')

  // Fallback data when APIs fail or are loading
  const fallbackBadges = [
    {
      id: 'tree-planter',
      name: 'Tree Planter',
      description: 'Plant your first tree and contribute to reforestation',
      icon: '🌱',
      category: 'eco_action',
      pointsRequired: 100,
      rarity: 'common' as const,
      criteria: { type: 'points' as const, target: 100 },
      isActive: true
    },
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Complete 10 environmental tasks and make a difference',
      icon: '🛡️',
      category: 'leadership',
      pointsRequired: 500,
      rarity: 'rare' as const,
      criteria: { type: 'tasks' as const, target: 10 },
      isActive: true
    },
    {
      id: 'pollution-reporter',
      name: 'Pollution Reporter',
      description: 'Document 5 pollution incidents in your community',
      icon: '📸',
      category: 'community',
      pointsRequired: 200,
      rarity: 'common' as const,
      criteria: { type: 'tasks' as const, target: 5 },
      isActive: true
    },
    {
      id: 'energy-saver',
      name: 'Energy Saver',
      description: 'Complete 3 energy conservation tasks',
      icon: '⚡',
      category: 'eco_action',
      pointsRequired: 150,
      rarity: 'uncommon' as const,
      criteria: { type: 'tasks' as const, target: 3 },
      isActive: true
    },
    {
      id: 'climate-champion',
      name: 'Climate Champion',
      description: 'Earn 1000 eco-points through various activities',
      icon: '🏆',
      category: 'leadership',
      pointsRequired: 1000,
      rarity: 'epic' as const,
      criteria: { type: 'points' as const, target: 1000 },
      isActive: true
    }
  ]

  const fallbackUserBadges = [
    {
      badgeId: 'tree-planter',
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || ''
    },
    {
      badgeId: 'pollution-reporter',
      earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || ''
    }
  ]

  const fallbackLeaderboard = [
    { userId: 'user1', userName: 'Arjun Sharma', points: 2450, ecoPoints: 2450, level: 12, rank: 1, avatar: null, school: 'Delhi Public School', badges: 5 },
    { userId: 'user2', userName: 'Priya Patel', points: 2180, ecoPoints: 2180, level: 11, rank: 2, avatar: null, school: 'Kendriya Vidyalaya', badges: 4 },
    { userId: 'user3', userName: 'Rohit Singh', points: 1875, ecoPoints: 1875, level: 9, rank: 3, avatar: null, school: 'St. Mary\'s High School', badges: 4 },
    { userId: user?.id || 'user4', userName: 'You', points: 1520, ecoPoints: 1520, level: 7, rank: 4, avatar: null, school: 'Your School', badges: 3 },
    { userId: 'user5', userName: 'Vikram Reddy', points: 1380, ecoPoints: 1380, level: 8, rank: 5, avatar: null, school: 'Narayana High School', badges: 3 },
  ]

  const loading = badgesLoading || leaderboardLoading
  const error = badgesError || leaderboardError

  // Use fallback data when API data is not available or loading
  const displayBadges = allBadges && allBadges.length > 0 ? allBadges : fallbackBadges
  const displayUserBadges = userBadgesList && userBadgesList.length > 0 ? userBadgesList : fallbackUserBadges
  const displayLeaderboard = leaderboard && leaderboard.length > 0 ? leaderboard : fallbackLeaderboard
  const displayUserRank = userRank || { rank: 15, totalParticipants: 1500, percentile: 70 }

  // Mock points history for the points tab
  const pointsHistory = {
    lesson: 450,
    task: 380,
    badge: 290,
    quiz: 190,
    weekly: 250,
    monthly: 950
  }

  // Filter badges based on category
  const filteredBadges = (displayBadges || []).filter(badge => {
    if (badgeFilter === 'all') return true
    return badge.category === badgeFilter || badge.rarity === badgeFilter
  })

  // Get current leaderboard based on filter (create mock structure)
  const currentLeaderboard = {
    id: `${leaderboardFilter}-leaderboard`,
    type: leaderboardFilter,
    scope: leaderboardFilter,
    entries: displayLeaderboard || [],
    period: 'all_time' as const,
    updatedAt: new Date().toISOString()
  }

  // Calculate user stats from available data
  const userStats = {
    totalPoints: totalPoints || 1520,
    level: level || 7,
    badgesEarned: displayUserBadges.length,
    rank: displayUserRank?.rank || 15,
    weeklyPoints: 250,
    monthlyPoints: 950,
    currentStreak: 7,
    streakMultiplier: 1.2
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the gamification module.</p>
          <Link href="/sign-in" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Sign In
          </Link>
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
              {loading ? (
                <div className="col-span-3 text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading badges...</p>
                </div>
              ) : error ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-red-500">Error loading badges: {error.message}</p>
                </div>
              ) : filteredBadges.length > 0 ? (
                filteredBadges.map((badge) => {
                  const isEarned = displayUserBadges.some(ub => ub.badgeId === badge.id)
                  const earnedBadge = displayUserBadges.find(ub => ub.badgeId === badge.id)
                  const progressPercent = badge.pointsRequired 
                    ? Math.min((userStats.totalPoints / badge.pointsRequired) * 100, 100)
                    : 0
                  
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isEarned={isEarned}
                      earnedAt={earnedBadge?.earnedAt}
                      showProgress={!isEarned}
                      progress={progressPercent}
                    />
                  )
                })
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No badges found for this category.</p>
                </div>
              )}
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading leaderboard: {error.message}</p>
                </div>
              ) : currentLeaderboard?.entries?.length > 0 ? (
                <Leaderboard
                  leaderboard={currentLeaderboard}
                  currentUserId={user?.id || ''}
                  onUserClick={(userId) => console.log('User clicked:', userId)}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No leaderboard data available.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Points Tab */}
        {selectedTab === 'points' && (
          <div className="space-y-8">
            {/* Points Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Points Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {userStats.currentStreak}🔥
                  </div>
                  <div className="text-gray-500">Day Streak</div>
                  <div className="text-xs text-orange-600 font-medium">
                    {userStats.streakMultiplier}x bonus
                  </div>
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading activity...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading activity data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(pointsHistory).length > 0 ? (
                    Object.entries(pointsHistory)
                      .filter(([key]) => key !== 'weekly' && key !== 'monthly')
                      .map(([activityType, points], index) => {
                        // Determine color based on activity type
                        let color = 'green';
                        let label = 'Activity';
                        
                        if (activityType === 'lesson') {
                          color = 'green';
                          label = 'Completed lessons';
                        } else if (activityType === 'badge') {
                          color = 'blue';
                          label = 'Earned badges';
                        } else if (activityType === 'task') {
                          color = 'purple';
                          label = 'Completed tasks';
                        } else if (activityType === 'quiz') {
                          color = 'orange';
                          label = 'Completed quizzes';
                        }
                        
                        return (
                          <div key={index} className={`flex items-center justify-between p-3 rounded-lg bg-${color}-50`}>
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center mr-3`}>
                                <span className={`text-${color}-600`}>
                                  {activityType === 'lesson' ? '📚' : 
                                   activityType === 'badge' ? '🏆' : 
                                   activityType === 'task' ? '✅' : 
                                   activityType === 'quiz' ? '❓' : '🌟'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{label}</div>
                                <div className="text-sm text-gray-500">Total points earned</div>
                              </div>
                            </div>
                            <div className={`text-lg font-bold text-${color}-600`}>+{points}</div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No activity recorded yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
