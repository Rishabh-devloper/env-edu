'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import { useEnhancedUserData } from '@/hooks/useEnhancedData'
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Flame,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'

interface ActivityFeedProps {
  showGlobalActivity?: boolean
  maxItems?: number
  className?: string
}

interface ActivityItem {
  id: string
  type: 'task_completed' | 'badge_earned' | 'lesson_completed' | 'level_up' | 'streak_milestone' | 'quiz_completed'
  userId: string
  userName?: string
  title: string
  description: string
  points?: number
  metadata?: Record<string, any>
  timestamp: string
  isGlobal?: boolean
}

export default function ActivityFeed({ 
  showGlobalActivity = false, 
  maxItems = 10,
  className = '' 
}: ActivityFeedProps) {
  const { user, isSignedIn } = useUser()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'personal' | 'achievements'>('all')

  const {
    userProgress,
    badges,
    notifications,
    loading: dataLoading,
    refreshData
  } = useEnhancedUserData({
    enablePolling: true,
    pollingInterval: 20000 // Poll every 20 seconds for activity updates
  })

  // Generate activity items from user data and notifications
  useEffect(() => {
    if (!userProgress && !badges && !notifications) return
    if (loading && !dataLoading) return

    const newActivities: ActivityItem[] = []

    // Add recent notifications as activities
    if (notifications && notifications.length > 0) {
      notifications.slice(0, 5).forEach(notification => {
        newActivities.push({
          id: notification.id,
          type: notification.type as any,
          userId: notification.userId,
          userName: user?.firstName || 'You',
          title: notification.title,
          description: notification.message,
          points: notification.metadata?.points,
          metadata: notification.metadata,
          timestamp: notification.createdAt,
          isGlobal: false
        })
      })
    }

    // Add some simulated global activities for demonstration
    if (showGlobalActivity) {
      const globalActivities: ActivityItem[] = [
        {
          id: 'global-1',
          type: 'task_completed',
          userId: 'user-123',
          userName: 'Aanya S.',
          title: 'Community Cleanup Completed',
          description: 'Organized a beach cleanup and collected 25kg of plastic waste',
          points: 120,
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          isGlobal: true
        },
        {
          id: 'global-2',
          type: 'badge_earned',
          userId: 'user-456',
          userName: 'Rohan M.',
          title: 'Eco Warrior Badge Earned',
          description: 'Completed first environmental task',
          points: 50,
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          isGlobal: true
        },
        {
          id: 'global-3',
          type: 'streak_milestone',
          userId: 'user-789',
          userName: 'Priya K.',
          title: '7-Day Streak Achieved!',
          description: 'Maintained daily environmental learning for a week',
          points: 70,
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          isGlobal: true
        }
      ]

      newActivities.push(...globalActivities)
    }

    // Sort by timestamp (newest first) and limit
    const sortedActivities = newActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems)

    // Only update state if the activities have actually changed
    const activitiesJSON = JSON.stringify(sortedActivities)
    const currentActivitiesJSON = JSON.stringify(activities)
    
    if (activitiesJSON !== currentActivitiesJSON) {
      setActivities(sortedActivities)
      setLastUpdateTime(new Date().toLocaleTimeString())
    }
    
    setLoading(false)
  }, [userProgress, badges, notifications, showGlobalActivity, maxItems, user, dataLoading, activities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'badge_earned':
        return <Award className="w-5 h-5 text-yellow-500" />
      case 'lesson_completed':
        return <BookOpen className="w-5 h-5 text-blue-500" />
      case 'level_up':
        return <TrendingUp className="w-5 h-5 text-purple-500" />
      case 'streak_milestone':
        return <Flame className="w-5 h-5 text-orange-500" />
      case 'quiz_completed':
        return <Target className="w-5 h-5 text-indigo-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'bg-green-100 border-green-200'
      case 'badge_earned':
        return 'bg-yellow-100 border-yellow-200'
      case 'lesson_completed':
        return 'bg-blue-100 border-blue-200'
      case 'level_up':
        return 'bg-purple-100 border-purple-200'
      case 'streak_milestone':
        return 'bg-orange-100 border-orange-200'
      case 'quiz_completed':
        return 'bg-indigo-100 border-indigo-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return activityTime.toLocaleDateString()
  }

  // Memoize filtered activities to prevent unnecessary re-renders
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filter === 'personal') return !activity.isGlobal
      if (filter === 'achievements') return ['badge_earned', 'level_up', 'streak_milestone'].includes(activity.type)
      return true
    })
  }, [activities, filter])

  if (!isSignedIn) return null

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {showGlobalActivity ? 'Community Activity' : 'Your Activity'}
              </h3>
              <p className="text-sm text-gray-600">Updated {lastUpdateTime}</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading || dataLoading}
          >
            <RefreshCw className={`w-5 h-5 ${(loading || dataLoading) ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All Activity', icon: Activity },
            { id: 'personal', label: 'Personal', icon: Users },
            { id: 'achievements', label: 'Achievements', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.id
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No recent activity</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'personal' 
                ? 'Complete tasks or lessons to see your activity!'
                : 'Start learning to see activity here!'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        {activity.isGlobal && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                            Global
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {activity.points && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="font-medium text-yellow-600">+{activity.points}</span>
                          </div>
                        )}
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                    {/* User Attribution */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {activity.userName?.[0] || activity.userId[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {activity.isGlobal ? activity.userName : 'You'}
                        </span>
                      </div>

                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="flex items-center space-x-2">
                          {activity.metadata.badgeId && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                              {activity.metadata.badgeId}
                            </span>
                          )}
                          {activity.metadata.streak && (
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                              {activity.metadata.streak} day streak
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredActivities.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredActivities.length} recent activities</span>
            <span>Updates every 20 seconds</span>
          </div>
        </div>
      )}
    </div>
  )
}
