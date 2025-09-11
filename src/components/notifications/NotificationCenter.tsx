'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useEnhancedNotifications } from '@/hooks/useEnhancedData'
import {
  Bell,
  BellRing,
  X,
  Check,
  Award,
  TrendingUp,
  Users,
  Star,
  Calendar,
  AlertCircle,
  CheckCircle,
  Trophy,
  Target
} from 'lucide-react'

interface NotificationCenterProps {
  className?: string
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const { user, isSignedIn } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [lastSoundTime, setLastSoundTime] = useState(0)

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useEnhancedNotifications({
    enablePolling: true,
    pollingInterval: 15000 // Check for new notifications every 15 seconds
  })

  // Play notification sound for new notifications
  useEffect(() => {
    if (unreadCount > 0 && Date.now() - lastSoundTime > 30000) { // Limit to once per 30 seconds
      // Create audio notification (optional)
      try {
        const audio = new Audio('/sounds/notification.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {
          // Ignore errors if audio fails to play (user hasn't interacted with page yet)
        })
        setLastSoundTime(Date.now())
      } catch (error) {
        // Audio not available or failed
      }
    }
  }, [unreadCount, lastSoundTime])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge_earned':
        return <Award className="w-5 h-5 text-yellow-500" />
      case 'level_up':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'task_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'task_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'leaderboard_update':
        return <Trophy className="w-5 h-5 text-purple-500" />
      case 'new_task':
        return <Target className="w-5 h-5 text-blue-500" />
      case 'streak_milestone':
        return <Star className="w-5 h-5 text-orange-500" />
      case 'community':
        return <Users className="w-5 h-5 text-indigo-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'badge_earned':
        return 'bg-yellow-50 border-yellow-200'
      case 'level_up':
        return 'bg-green-50 border-green-200'
      case 'task_approved':
        return 'bg-green-50 border-green-200'
      case 'task_rejected':
        return 'bg-red-50 border-red-200'
      case 'leaderboard_update':
        return 'bg-purple-50 border-purple-200'
      case 'new_task':
        return 'bg-blue-50 border-blue-200'
      case 'streak_milestone':
        return 'bg-orange-50 border-orange-200'
      case 'community':
        return 'bg-indigo-50 border-indigo-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return notificationDate.toLocaleDateString()
  }

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId)
    }
  }

  if (!isSignedIn) return null

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500 text-sm">Failed to load notifications</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">Complete activities to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Display */}
                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                      <div className="mt-3 pl-8">
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          getNotificationColor(notification.type)
                        }`}>
                          {notification.metadata.badgeId && `Badge: ${notification.metadata.badgeId}`}
                          {notification.metadata.points && `+${notification.metadata.points} points`}
                          {notification.metadata.level && `Level ${notification.metadata.level}`}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Notifications are updated automatically
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click Outside to Close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
