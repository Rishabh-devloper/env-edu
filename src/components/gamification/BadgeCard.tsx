'use client'

import { Badge } from '@/types'
import { Award, Star, Crown, Zap } from 'lucide-react'

interface BadgeCardProps {
  badge: Badge
  isEarned?: boolean
  earnedAt?: string
  showProgress?: boolean
  progress?: number
}

export default function BadgeCard({ 
  badge, 
  isEarned = false, 
  earnedAt, 
  showProgress = false, 
  progress = 0 
}: BadgeCardProps) {
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Crown className="w-4 h-4" />
      case 'epic':
        return <Star className="w-4 h-4" />
      case 'rare':
        return <Award className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'eco_action':
        return 'bg-green-100 text-green-800'
      case 'knowledge':
        return 'bg-blue-100 text-blue-800'
      case 'leadership':
        return 'bg-purple-100 text-purple-800'
      case 'community':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
      isEarned 
        ? 'border-green-300 shadow-md' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Badge Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isEarned ? getRarityColor(badge.rarity) : 'bg-gray-200'
            }`}>
              {isEarned ? (
                <span className="text-xl">{badge.icon}</span>
              ) : (
                <span className="text-gray-400 text-xl">🔒</span>
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className={`text-sm ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                {badge.description}
              </p>
            </div>
          </div>
          
          {isEarned && (
            <div className="flex items-center text-green-600">
              <Award className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Earned</span>
            </div>
          )}
        </div>

        {/* Badge Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(badge.category)}`}>
              {badge.category.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
              {getRarityIcon(badge.rarity)}
              <span className="ml-1 capitalize">{badge.rarity}</span>
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Star className="w-4 h-4 mr-1" />
            {badge.pointsRequired} pts
          </div>
        </div>

        {/* Progress Bar (if not earned and showing progress) */}
        {!isEarned && showProgress && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Earned Date */}
        {isEarned && earnedAt && (
          <div className="text-xs text-gray-500">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Rarity Glow Effect */}
      {isEarned && badge.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 pointer-events-none"></div>
      )}
    </div>
  )
}
