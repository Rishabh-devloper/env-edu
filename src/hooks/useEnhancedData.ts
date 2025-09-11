'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'

// Enhanced Type Definitions
interface UserProgress {
  totalPoints: number
  level: number
  completedLessonsCount: number
  badges: string[]
  streak: {
    current: number
    longest: number
    multiplier: number
  }
  tasks: {
    completed: number
    pending: number
    pointsByCategory: Record<string, number>
  }
  completionRate: number
  nextLevelPoints: number
  earnedBadges: Array<{
    id: string
    name: string
    description: string
    icon: string
    category: string
    earnedAt: string
    progress: number
  }>
  currentStreak?: number
  streakMultiplier?: number
  pointsHistory?: {
    lessons: number
    tasks: number
    quizzes: number
    badges: number
    weekly: number
    monthly: number
  }
}

interface Task {
  id: string
  title: string
  description: string
  category: 'tree_planting' | 'waste_management' | 'energy_conservation' | 'water_conservation'
  difficulty: 'easy' | 'medium' | 'hard'
  ecoPoints: number
  estimatedTime: number
  requirements: {
    photoRequired: boolean
    locationRequired: boolean
    descriptionMinLength?: number
    verificationType: 'auto' | 'peer' | 'teacher'
    materials?: string[]
  }
  isActive: boolean
  createdBy: string
  createdAt: string
}

interface TaskSubmission {
  id: string
  taskId: string
  status: 'pending' | 'approved' | 'rejected'
  submission: {
    description: string
    photos?: string[]
    location?: {
      lat: number
      lng: number
      address: string
    }
  }
  submittedAt: string
  reviewedAt?: string
  feedback?: string
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  pointsRequired: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  criteria: {
    type: 'points' | 'lessons' | 'tasks' | 'streak' | 'quiz_score' | 'environmental_impact'
    target: number
    conditions?: Record<string, any>
  }
  isActive: boolean
  earnedAt?: string
  progress?: number
}

interface LeaderboardEntry {
  userId: string
  userName: string
  points: number
  level: number
  rank: number
  avatar?: string
  school?: string
  badges: number
}

interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'level_up' | 'task_approved' | 'task_rejected' | 'streak' | 'reminder' | 'badge_earned' | 'leaderboard_update' | 'new_task' | 'streak_milestone' | 'community'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  metadata?: {
    actionUrl?: string
    badgeId?: string
    taskId?: string
    points?: number
    level?: number
    streak?: number
  }
}

// Enhanced User Progress Hook with Real-time Updates
export function useEnhancedUserProgress() {
  const { user } = useUser()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      // Add a try-catch block specifically for the fetch operation
      let response;
      try {
        response = await fetch('/api/progress', {
          cache: 'no-store' // Always get fresh data
        })
      } catch (fetchErr) {
        console.error('Network error during fetch:', fetchErr)
        throw new Error('Network error: Unable to connect to the server')
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch progress`)
      }
      
      let data;
      try {
        data = await response.json()
      } catch (jsonErr) {
        console.error('Error parsing JSON response:', jsonErr)
        throw new Error('Invalid response format from server')
      }
      
      if (data && data.success) {
        setProgress(data.data || null)
        setLastUpdated(new Date())
      } else {
        throw new Error((data && data.error) || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress')
      console.error('Progress fetch error:', err)
      // Provide a fallback empty progress object to prevent null reference errors
      setProgress({
        totalPoints: 0,
        level: 1,
        completedLessonsCount: 0,
        badges: [],
        streak: { current: 0, longest: 0, multiplier: 1 },
        tasks: { completed: 0, pending: 0, pointsByCategory: {} },
        completionRate: 0,
        nextLevelPoints: 100
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    let isMounted = true;
    let pollingInterval: NodeJS.Timeout | null = null;
    
    const fetchInitialData = async () => {
      try {
        if (isMounted) {
          await fetchProgress();
        }
      } catch (error) {
        console.error('Error fetching initial progress data:', error);
      }
    };
    
    fetchInitialData();
    
    // Set up polling for real-time updates every 30 seconds with error handling
    try {
      pollingInterval = setInterval(() => {
        if (isMounted) {
          fetchProgress().catch(err => {
            console.error('Interval progress fetch failed:', err)
          })
        }
      }, 30000)
    } catch (err) {
      console.error('Failed to set up polling interval:', err)
    }
    
    // Clean up function with error handling
    return () => {
      isMounted = false;
      if (pollingInterval) {
        try {
          clearInterval(pollingInterval)
        } catch (err) {
          console.error('Failed to clear interval:', err)
        }
      }
    }
  }, [fetchProgress])

  const addPoints = async (points: number, reason?: string, activityType?: string) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_points',
          points, 
          reason: reason || 'Manual points addition',
          activityType: activityType || 'manual'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add points')
      }
      
      const data = await response.json()
      if (data.success) {
        // Refresh progress to get updated state
        await fetchProgress()
        return data.data
      } else {
        throw new Error(data.error || 'Failed to add points')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add points')
    }
  }

  const completeLesson = async (lessonId: string, points: number = 25) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_lesson',
          lessonId,
          points
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to complete lesson')
      }
      
      const data = await response.json()
      if (data.success) {
        await fetchProgress()
        return data.data
      } else {
        throw new Error(data.error || 'Failed to complete lesson')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to complete lesson')
    }
  }

  // Enhanced refresh method with error handling and loading state management
  const refresh = async () => {
    try {
      setLoading(true)
      await fetchProgress()
      return true
    } catch (err) {
      console.error('Manual refresh failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh progress')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    progress, 
    loading, 
    error, 
    lastUpdated,
    addPoints, 
    completeLesson,
    refresh
  }
}


// Enhanced Badges Hook with Progress Tracking
export function useEnhancedBadges() {
  const { user } = useUser()
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBadges = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const [allBadgesRes, userBadgesRes] = await Promise.all([
        fetch('/api/badges?action=all'),
        fetch('/api/badges?action=user')
      ])
      
      if (allBadgesRes.ok) {
        const allBadgesData = await allBadgesRes.json()
        if (allBadgesData.success) {
          setAllBadges(allBadgesData.badges || [])
        }
      }
      
      if (userBadgesRes.ok) {
        const userBadgesData = await userBadgesRes.json()
        if (userBadgesData.success) {
          setUserBadges(userBadgesData.badges || [])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch badges')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBadges()
  }, [fetchBadges])

  const checkForNewBadges = async () => {
    try {
      const response = await fetch('/api/badges?action=check')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.newBadges.length > 0) {
          // Refresh badges to show newly earned ones
          await fetchBadges()
          return data.newBadges
        }
      }
      return []
    } catch (err) {
      console.error('Error checking for new badges:', err)
      return []
    }
  }

  const getBadgeProgress = (badge: Badge, userProgress?: UserProgress) => {
    if (!userProgress) return 0
    
    switch (badge.criteria.type) {
      case 'points':
        return Math.min((userProgress.totalPoints / badge.criteria.target) * 100, 100)
      case 'lessons':
        return Math.min((userProgress.completedLessonsCount / badge.criteria.target) * 100, 100)
      case 'streak':
        return Math.min((userProgress.streak.current / badge.criteria.target) * 100, 100)
      case 'tasks':
        return Math.min((userProgress.tasks.completed / badge.criteria.target) * 100, 100)
      default:
        return 0
    }
  }

  return { 
    allBadges, 
    userBadges, 
    loading, 
    error, 
    checkForNewBadges,
    getBadgeProgress,
    refresh: fetchBadges
  }
}

// Enhanced Leaderboard Hook with Multiple Scopes
export function useEnhancedLeaderboard(
  type: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time',
  scope: 'global' | 'school' | 'class' = 'global'
) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<{
    rank: number | null
    totalParticipants: number
    percentile: number | null
  }>({ rank: null, totalParticipants: 0, percentile: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams({
        type,
        scope
      })
      
      const [leaderboardRes, rankRes] = await Promise.all([
        fetch(`/api/leaderboard?${params}`),
        fetch(`/api/leaderboard/rank?${params}`)
      ])
      
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        if (leaderboardData.success) {
          setLeaderboard(leaderboardData.data || [])
        }
      }
      
      if (rankRes.ok) {
        const rankData = await rankRes.json()
        if (rankData.success) {
          setUserRank(rankData.data || { rank: null, totalParticipants: 0, percentile: null })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
    } finally {
      setLoading(false)
    }
  }, [type, scope])

  useEffect(() => {
    fetchLeaderboard()
    
    // Refresh leaderboard every 5 minutes
    const interval = setInterval(fetchLeaderboard, 300000)
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  return { 
    leaderboard, 
    userRank, 
    loading, 
    error, 
    refresh: fetchLeaderboard 
  }
}

// Enhanced Notifications Hook
export function useEnhancedNotifications(options?: {
  enablePolling?: boolean
  pollingInterval?: number
}) {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize options to prevent infinite loops
  const memoizedOptions = useMemo(() => ({
    enablePolling: options?.enablePolling !== false,
    pollingInterval: options?.pollingInterval || 30000
  }), [options?.enablePolling, options?.pollingInterval])

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const [notificationsRes, countRes] = await Promise.all([
        fetch('/api/notifications'),
        fetch('/api/notifications/count')
      ])
      
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        if (notificationsData.success) {
          setNotifications(notificationsData.notifications || [])
        }
      }
      
      if (countRes.ok) {
        const countData = await countRes.json()
        if (countData.success) {
          setUnreadCount(countData.count || 0)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications based on options
    if (memoizedOptions.enablePolling) {
      const interval = setInterval(
        fetchNotifications, 
        memoizedOptions.pollingInterval
      )
      return () => clearInterval(interval)
    }
  }, [fetchNotifications, memoizedOptions.enablePolling, memoizedOptions.pollingInterval])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const wasUnread = notifications.find(n => n.id === notificationId && !n.isRead)
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  }
}

// Enhanced Leaderboards Hook with Multiple Scopes
export function useEnhancedLeaderboards(options: {
  scope?: 'global' | 'school' | 'class'
  period?: 'daily' | 'weekly' | 'monthly' | 'all_time'
  enablePolling?: boolean
  pollingInterval?: number
}) {
  const { user } = useUser()
  const [leaderboards, setLeaderboards] = useState<{
    global?: { entries: LeaderboardEntry[] }
    school?: { entries: LeaderboardEntry[] }
    class?: { entries: LeaderboardEntry[] }
  }>({})
  const [userRank, setUserRank] = useState<number>(0)
  const [nearbyUsers, setNearbyUsers] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Memoize options to prevent infinite loops
  const memoizedOptions = useMemo(() => ({
    scope: options?.scope || 'global',
    period: options?.period || 'weekly',
    enablePolling: options?.enablePolling !== false,
    pollingInterval: options?.pollingInterval || 30000
  }), [options?.scope, options?.period, options?.enablePolling, options?.pollingInterval])

  const refreshData = useCallback(async () => {
    if (!user) return

    try {
      setError(null)
      const { scope, period } = memoizedOptions
      
      const [leaderboardRes, rankRes] = await Promise.all([
        fetch(`/api/leaderboard?scope=${scope}&period=${period}`),
        fetch(`/api/leaderboard/rank?scope=${scope}&period=${period}`)
      ])

      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        if (leaderboardData.success) {
          setLeaderboards({
            [scope]: { entries: leaderboardData.data || [] }
          })
        }
      }

      if (rankRes.ok) {
        const rankData = await rankRes.json()
        if (rankData.success) {
          setUserRank(rankData.rank || 0)
          setNearbyUsers(rankData.nearby || [])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch leaderboards'))
    } finally {
      setLoading(false)
    }
  }, [user, memoizedOptions])

  useEffect(() => {
    refreshData()

    if (memoizedOptions.enablePolling) {
      const interval = setInterval(
        refreshData,
        memoizedOptions.pollingInterval
      )
      return () => clearInterval(interval)
    }
  }, [refreshData, memoizedOptions.enablePolling, memoizedOptions.pollingInterval])

  return {
    leaderboards,
    userRank,
    nearbyUsers,
    loading,
    error,
    refreshData
  }
}

// Enhanced Tasks Hook with Submissions
export function useEnhancedTasks(options?: {
  enablePolling?: boolean
  pollingInterval?: number
}) {
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [userSubmissions, setUserSubmissions] = useState<TaskSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Memoize options to prevent infinite loops
  const memoizedOptions = useMemo(() => ({
    enablePolling: options?.enablePolling !== false,
    pollingInterval: options?.pollingInterval || 60000
  }), [options?.enablePolling, options?.pollingInterval])

  const refreshData = useCallback(async () => {
    if (!user) return

    try {
      setError(null)
      const [tasksRes, submissionsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/tasks/submissions')
      ])

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        if (tasksData.success) {
          setTasks(tasksData.tasks || [])
        }
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json()
        if (submissionsData.success) {
          setUserSubmissions(submissionsData.submissions || [])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
    } finally {
      setLoading(false)
    }
  }, [user])

  const submitTask = useCallback(async (submissionData: {
    taskId: string
    description: string
    photos: string[]
    location: { lat: number; lng: number } | null
  }) => {
    try {
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to submit task' }
      }

      const result = await response.json()
      if (result.success) {
        await refreshData()
      }
      return result
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to submit task'
      }
    }
  }, [refreshData])

  useEffect(() => {
    refreshData()

    if (memoizedOptions.enablePolling) {
      const interval = setInterval(
        refreshData,
        memoizedOptions.pollingInterval
      )
      return () => clearInterval(interval)
    }
  }, [refreshData, memoizedOptions.enablePolling, memoizedOptions.pollingInterval])

  return {
    tasks,
    userSubmissions,
    loading,
    error,
    submitTask,
    refreshData
  }
}

// Enhanced User Data Hook that combines all data
export function useEnhancedUserData(options?: {
  enablePolling?: boolean
  pollingInterval?: number
}) {
  // Memoize options to prevent infinite loops in child hooks
  const memoizedOptions = useMemo(() => ({
    enablePolling: options?.enablePolling,
    pollingInterval: options?.pollingInterval
  }), [options?.enablePolling, options?.pollingInterval])

  const leaderboardOptions = useMemo(() => ({
    enablePolling: memoizedOptions.enablePolling,
    pollingInterval: memoizedOptions.pollingInterval
  }), [memoizedOptions.enablePolling, memoizedOptions.pollingInterval])

  const progress = useEnhancedUserProgress()
  const badges = useEnhancedBadges()
  const leaderboards = useEnhancedLeaderboards(leaderboardOptions)
  const notifications = useEnhancedNotifications(memoizedOptions)

  const loading = progress.loading || badges.loading || leaderboards.loading || notifications.loading
  const error = progress.error || badges.error || leaderboards.error || notifications.error

  const refreshData = useCallback(async () => {
    await Promise.all([
      progress.refresh(),
      badges.refresh(),
      leaderboards.refreshData(),
      notifications.refresh()
    ])
  }, [progress.refresh, badges.refresh, leaderboards.refreshData, notifications.refresh])

  return {
    userProgress: progress.progress,
    badges: {
      availableBadges: badges.allBadges,
      userBadges: badges.userBadges
    },
    leaderboards: leaderboards.leaderboards,
    notifications: notifications.notifications,
    loading,
    error: error ? new Error(error) : null,
    refreshData
  }
}

// Real-time Activity Hook
export function useRealTimeUpdates() {
  const { user } = useUser()
  const [isOnline, setIsOnline] = useState(true)
  const [lastActivity, setLastActivity] = useState<Date>(new Date())
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Track user activity for streak purposes
    const trackActivity = () => setLastActivity(new Date())
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    
    events.forEach(event => {
      window.addEventListener(event, trackActivity)
    })
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      events.forEach(event => {
        window.removeEventListener(event, trackActivity)
      })
    }
  }, [])
  
  const recordActivity = async (activityType: string, metadata?: any) => {
    if (!user || !isOnline) return
    
    try {
      await fetch('/api/activity/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType,
          metadata,
          timestamp: new Date().toISOString()
        })
      })
    } catch (err) {
      console.warn('Failed to record activity:', err)
    }
  }
  
  return {
    isOnline,
    lastActivity,
    recordActivity
  }
}
