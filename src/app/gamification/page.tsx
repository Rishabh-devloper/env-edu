'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { usePoints } from '@/contexts/PointsContext'
import { useState, useEffect } from 'react'
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
import Link from 'next/link'

export default function GamificationPage() {
  const { isSignedIn, user } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()
  const { totalPoints, level, badges } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'badges' | 'leaderboard' | 'points'>('badges')
  const [badgeFilter, setBadgeFilter] = useState<string>('all')
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>('class')
  
  // State for dynamic data
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [leaderboardData, setLeaderboardData] = useState<{ [key: string]: LeaderboardType }>({})
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState({
    badges: true,
    leaderboard: true,
    points: true
  })

  // Fetch all available badges
  useEffect(() => {
    async function fetchBadges() {
      try {
        setIsLoading(prev => ({ ...prev, badges: true }))
        const response = await fetch('/api/badges?action=all')
        const userBadgesResponse = await fetch('/api/badges?action=user')
        
        if (response.ok && userBadgesResponse.ok) {
          const data = await response.json()
          const userBadgesData = await userBadgesResponse.json()
          
          // Map user badges to include earnedAt information
          const userBadgesMap = new Map()
          if (userBadgesData.badges && Array.isArray(userBadgesData.badges)) {
            userBadgesData.badges.forEach((badge: any) => {
              userBadgesMap.set(badge.id, badge.earnedAt || new Date().toISOString())
            })
          }
          
          // Add earnedAt to all badges that the user has earned
          const badgesWithEarnedInfo = (data.badges || []).map((badge: any) => {
            if (userBadgesMap.has(badge.id)) {
              return { ...badge, earnedAt: userBadgesMap.get(badge.id) }
            }
            return badge
          })
          
          setAllBadges(badgesWithEarnedInfo)
          setBadges(Array.from(userBadgesMap.keys()))
        }
      } catch (error) {
        console.error('Error fetching badges:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, badges: false }))
      }
    }
    
    fetchBadges()
  }, [])

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setIsLoading(prev => ({ ...prev, leaderboard: true }))
        const classResponse = await fetch('/api/leaderboard?scope=class')
        const schoolResponse = await fetch('/api/leaderboard?scope=school')
        const globalResponse = await fetch('/api/leaderboard?scope=global')
        
        const leaderboards: { [key: string]: LeaderboardType } = {}
        
        if (classResponse.ok) {
          const data = await classResponse.json()
          leaderboards.class = {
            id: 'class-leaderboard',
            type: 'class',
            scope: 'class',
            entries: data.data || [],
            period: 'all_time',
            updatedAt: new Date().toISOString()
          }
        }
        
        if (schoolResponse.ok) {
          const data = await schoolResponse.json()
          leaderboards.school = {
            id: 'school-leaderboard',
            type: 'school',
            scope: 'school',
            entries: data.data || [],
            period: 'all_time',
            updatedAt: new Date().toISOString()
          }
        }
        
        if (globalResponse.ok) {
          const data = await globalResponse.json()
          leaderboards.global = {
            id: 'global-leaderboard',
            type: 'global',
            scope: 'global',
            entries: data.data || [],
            period: 'all_time',
            updatedAt: new Date().toISOString()
          }
        }
        
        setLeaderboardData(leaderboards)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, leaderboard: false }))
      }
    }
    
    fetchLeaderboard()
  }, [])

  // Fetch points history
  useEffect(() => {
    async function fetchPointsHistory() {
      if (!isSignedIn) return
      
      try {
        setIsLoading(prev => ({ ...prev, points: true }))
        const response = await fetch('/api/progress')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // We'll use this data for the points tab
            setPointsHistory(data.data.pointsByActivity || {})
          }
        }
      } catch (error) {
        console.error('Error fetching points history:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, points: false }))
      }
    }
    
    fetchPointsHistory()
  }, [isSignedIn])

  // Filter badges based on category
  const filteredBadges = allBadges.filter(badge => {
    if (badgeFilter === 'all') return true
    return badge.category === badgeFilter
  })

  // Get current leaderboard based on filter
  const currentLeaderboard = leaderboardData[leaderboardFilter] || {
    id: `${leaderboardFilter}-leaderboard`,
    type: leaderboardFilter,
    scope: leaderboardFilter,
    entries: [],
    period: 'all_time',
    updatedAt: new Date().toISOString()
  }

  // Calculate user stats from context and fetched data
  const userStats = {
    totalPoints,
    level,
    badgesEarned: badges.length,
    rank: leaderboardData[leaderboardFilter]?.entries?.findIndex(entry => entry.userId === user?.id) + 1 || 0,
    weeklyPoints: pointsHistory?.weekly || 0,
    monthlyPoints: pointsHistory?.monthly || 0
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
              {isLoading.badges ? (
                <div className="col-span-3 text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading badges...</p>
                </div>
              ) : filteredBadges.length > 0 ? (
                filteredBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isEarned={badges.includes(badge.id)}
                    earnedAt={badge.earnedAt}
                    showProgress={!badges.includes(badge.id)}
                    progress={Math.min((userStats.totalPoints / badge.pointsRequired) * 100, 100)}
                  />
                ))
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
              {isLoading.leaderboard ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              ) : leaderboardData[leaderboardFilter]?.entries?.length > 0 ? (
                <Leaderboard
                  leaderboard={leaderboardData[leaderboardFilter]}
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
              {isLoading.points ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="text-gray-500">Loading activity...</p>
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
