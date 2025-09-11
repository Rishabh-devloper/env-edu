'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useEnhancedLeaderboards } from '@/hooks/useEnhancedData'
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Calendar,
  Filter,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react'

interface LiveLeaderboardProps {
  scope?: 'global' | 'school' | 'class'
  period?: 'daily' | 'weekly' | 'monthly' | 'all_time'
  maxEntries?: number
  showRankChanges?: boolean
  className?: string
}

export default function LiveLeaderboard({
  scope = 'class',
  period = 'weekly',
  maxEntries = 20,
  showRankChanges = true,
  className = ''
}: LiveLeaderboardProps) {
  const { user, isSignedIn } = useUser()
  const [selectedScope, setSelectedScope] = useState(scope)
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [showUserOnly, setShowUserOnly] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('')

  const {
    leaderboards,
    userRank,
    nearbyUsers,
    loading,
    error,
    refreshData
  } = useEnhancedLeaderboards({
    scope: selectedScope,
    period: selectedPeriod,
    enablePolling: true,
    pollingInterval: 30000 // Update every 30 seconds for live updates
  })

  useEffect(() => {
    setLastUpdateTime(new Date().toLocaleTimeString())
  }, [leaderboards])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const formatPoints = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`
    return points.toString()
  }

  const getDisplayData = () => {
    const currentLeaderboard = leaderboards?.[selectedScope]
    
    if (!currentLeaderboard) return []
    
    if (showUserOnly && nearbyUsers) {
      return nearbyUsers.slice(0, maxEntries)
    }
    
    return currentLeaderboard.entries.slice(0, maxEntries)
  }

  const displayData = getDisplayData()

  if (!isSignedIn) return null

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Live Leaderboard</h3>
              <p className="text-sm text-gray-600">Updated {lastUpdateTime}</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Scope Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['class', 'school', 'global'].map((scopeOption) => (
              <button
                key={scopeOption}
                onClick={() => setSelectedScope(scopeOption as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedScope === scopeOption
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {scopeOption === 'class' && <Users className="w-4 h-4 inline mr-1" />}
                {scopeOption === 'school' && <Target className="w-4 h-4 inline mr-1" />}
                {scopeOption === 'global' && <Zap className="w-4 h-4 inline mr-1" />}
                {scopeOption.charAt(0).toUpperCase() + scopeOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Period Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['daily', 'weekly', 'monthly', 'all_time'].map((periodOption) => (
              <button
                key={periodOption}
                onClick={() => setSelectedPeriod(periodOption as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === periodOption
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {periodOption === 'all_time' ? 'All Time' : periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Show Near Me Toggle */}
          <button
            onClick={() => setShowUserOnly(!showUserOnly)}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
              showUserOnly
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showUserOnly ? 'Show All' : 'Near Me'}
          </button>
        </div>
      </div>

      {/* Current User Rank */}
      {userRank && userRank > 0 && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-purple-700">#{userRank}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Your Rank</p>
                <p className="text-sm text-gray-600">Keep going to climb higher!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600">
                {formatPoints(displayData.find(entry => entry.userId === user?.id)?.points || 0)}
              </p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-500 font-medium">Failed to load leaderboard</p>
            <p className="text-gray-500 text-sm mt-2">{error.message}</p>
            <button
              onClick={refreshData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No rankings yet</p>
            <p className="text-gray-400 text-sm mt-1">Complete activities to see leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayData.map((entry, index) => {
              const isCurrentUser = entry.userId === user?.id
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                    isCurrentUser
                      ? 'bg-purple-50 border-purple-200 scale-105'
                      : 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  {/* Rank Icon */}
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {entry.userName?.[0] || entry.userId[0].toUpperCase()}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium truncate ${
                        isCurrentUser ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {entry.userName || `User ${entry.userId.slice(0, 8)}`}
                        {isCurrentUser && <span className="text-purple-600 text-sm ml-2">(You)</span>}
                      </p>
                      {showRankChanges && entry.rankChange !== undefined && (
                        <div className="flex items-center space-x-1">
                          {getRankChangeIcon(entry.rankChange)}
                          {Math.abs(entry.rankChange) > 0 && (
                            <span className={`text-xs font-medium ${
                              entry.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.abs(entry.rankChange)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {entry.school || 'Unknown School'} • {entry.streakDays || 0} day streak
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isCurrentUser ? 'text-purple-600' : 'text-gray-900'
                    }`}>
                      {formatPoints(entry.points)}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isCurrentUser
                        ? 'bg-purple-200 text-purple-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      L{entry.level || 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer with Stats */}
      {displayData.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {displayData.length} {showUserOnly ? 'nearby users' : 'top performers'}
            </span>
            <span>
              Updates every 30 seconds
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
