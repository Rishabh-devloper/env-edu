'use client'

import { useState, useEffect, useCallback } from 'react'
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
  pointsByActivity: {
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
  type: 'achievement' | 'level_up' | 'task_approved' | 'streak' | 'reminder'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: {
    actionUrl?: string
    badgeId?: string
    taskId?: string
    points?: number
    level?: number
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
      const response = await fetch('/api/progress', {
        cache: 'no-store' // Always get fresh data
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch progress`)
      }
      
      const data = await response.json()
      if (data.success) {
        setProgress(data.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress')
      console.error('Progress fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProgress()
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchProgress, 30000)
    return () => clearInterval(interval)
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

  return { 
    progress, 
    loading, 
    error, 
    lastUpdated,
    addPoints, 
    completeLesson,
    refresh: fetchProgress
  }
}

// Enhanced Tasks Hook with Submission Management
export function useEnhancedTasks(category?: string, difficulty?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (difficulty) params.append('difficulty', difficulty)
      
      const [tasksRes, submissionsRes] = await Promise.all([
        fetch(`/api/tasks?${params}`),
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
          setSubmissions(submissionsData.submissions || [])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [category, difficulty])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const submitTask = async (taskId: string, submissionData: {
    description: string
    photos?: File[]
    location?: { lat: number; lng: number; address: string }
  }) => {
    try {
      // Handle file uploads if photos are provided
      let photoUrls: string[] = []
      if (submissionData.photos && submissionData.photos.length > 0) {
        // This would typically upload to a cloud service
        // For now, we'll simulate with base64 or placeholder URLs
        photoUrls = submissionData.photos.map((file, index) => 
          `placeholder-photo-${taskId}-${index}.jpg`
        )
      }
      
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          submission: {
            description: submissionData.description,
            photos: photoUrls,
            location: submissionData.location
          }
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit task')
      }
      
      const result = await response.json()
      if (result.success) {
        // Refresh submissions to show the new one
        await fetchTasks()
        return result.data
      } else {
        throw new Error(result.error || 'Failed to submit task')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit task')
    }
  }

  const getTaskStats = () => {
    const completed = submissions.filter(s => s.status === 'approved').length
    const pending = submissions.filter(s => s.status === 'pending').length
    const rejected = submissions.filter(s => s.status === 'rejected').length
    
    return {
      total: tasks.length,
      submitted: submissions.length,
      completed,
      pending,
      rejected,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    }
  }

  return { 
    tasks, 
    submissions, 
    loading, 
    error, 
    submitTask, 
    getTaskStats,
    refresh: fetchTasks
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

// Notifications Hook
export function useNotifications() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

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

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
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
