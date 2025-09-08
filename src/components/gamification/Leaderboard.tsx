'use client'

import { Leaderboard as LeaderboardType, LeaderboardEntry } from '@/types'
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react'

interface LeaderboardProps {
  leaderboard: LeaderboardType
  currentUserId?: string
  onUserClick?: (userId: string) => void
}

export default function Leaderboard({ leaderboard, currentUserId, onUserClick }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500 text-sm font-bold">
          {rank}
        </span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'daily':
        return 'Today'
      case 'weekly':
        return 'This Week'
      case 'monthly':
        return 'This Month'
      case 'all_time':
        return 'All Time'
      default:
        return period
    }
  }

  const getScopeText = (type: string, scope: string) => {
    switch (type) {
      case 'class':
        return `Class ${scope}`
      case 'school':
        return `School ${scope}`
      case 'ngo':
        return `NGO ${scope}`
      case 'global':
        return 'Global'
      default:
        return scope
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              {getScopeText(leaderboard.type, leaderboard.scope)} Leaderboard
            </h3>
            <p className="text-sm text-gray-600">
              {getPeriodText(leaderboard.period)} • Updated {new Date(leaderboard.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {leaderboard.entries.length} participants
          </div>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="divide-y divide-gray-200">
        {leaderboard.entries.map((entry, index) => {
          const isCurrentUser = currentUserId === entry.userId
          
          return (
            <div
              key={entry.userId}
              onClick={() => onUserClick?.(entry.userId)}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                isCurrentUser ? 'bg-green-50 border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {entry.avatar ? (
                        <img 
                          src={entry.avatar} 
                          alt={entry.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium text-sm">
                          {entry.userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-green-800' : 'text-gray-900'}`}>
                        {entry.userName}
                        {isCurrentUser && (
                          <span className="ml-2 text-green-600 text-sm">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Level {entry.level} • {entry.badges} badges
                      </p>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {entry.ecoPoints.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">eco points</p>
                </div>
              </div>

              {/* Progress Bar for Top 3 */}
              {entry.rank <= 3 && index > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>vs #1</span>
                    <span>
                      {Math.round(((entry.ecoPoints / leaderboard.entries[0].ecoPoints) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(entry.ecoPoints / leaderboard.entries[0].ecoPoints) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Rankings update every hour</span>
          </div>
          <span>Last updated: {leaderboard.updatedAt.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
