import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { BadgeSystem, Badge, UserBadge, UserProgress } from '@/lib/badge-system'
import { toast } from 'sonner'

interface ActivityFeedItem {
  id: number
  userId: string
  activityType: string
  activityTitle: string
  activityDescription: string
  pointsEarned: number
  metadata: Record<string, any>
  createdAt: string
}

interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  totalPoints: number
  level: number
  badgesEarned: number
  position: number
}

interface QuizData {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionsCount: number
  estimatedTime: number
  isCompleted: boolean
  bestScore?: number
  lastAttempt?: string
}

interface EnhancedUserData {
  // User Progress
  userProgress: UserProgress | null
  
  // Badges
  availableBadges: Badge[]
  userBadges: UserBadge[]
  recentBadges: UserBadge[]
  badgeProgress: Map<string, number>
  
  // Activity & Social
  activityFeed: ActivityFeedItem[]
  recentAchievements: ActivityFeedItem[]
  
  // Leaderboards
  globalLeaderboard: LeaderboardEntry[]
  weeklyLeaderboard: LeaderboardEntry[]
  userRanking: {
    global: number
    weekly: number
    percentile: number
  }
  
  // Quizzes & Learning
  availableQuizzes: QuizData[]
  completedQuizzes: QuizData[]
  recommendedQuizzes: QuizData[]
  
  // Statistics & Insights
  stats: {
    totalLearningTime: number
    completionRate: number
    averageScore: number
    impactMetrics: {
      treesPlanted: number
      wasteRecycled: number
      energySaved: number
      waterSaved: number
    }
    streakData: {
      current: number
      longest: number
      weeklyGoal: number
      progress: number
    }
  }
  
  // Loading states
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  
  // Actions
  refreshData: () => Promise<void>
  updateProgress: (activityType: string, data: any) => Promise<void>
  completeQuiz: (quizId: string, score: number, answers: any[]) => Promise<void>
  completeTask: (taskId: string, impact?: any) => Promise<void>
  earnBadge: (badgeId: string) => Promise<void>
}

export function useEnhancedUserData(): EnhancedUserData {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState<Partial<EnhancedUserData>>({
    userProgress: null,
    availableBadges: [],
    userBadges: [],
    recentBadges: [],
    badgeProgress: new Map(),
    activityFeed: [],
    recentAchievements: [],
    globalLeaderboard: [],
    weeklyLeaderboard: [],
    userRanking: { global: 0, weekly: 0, percentile: 0 },
    availableQuizzes: [],
    completedQuizzes: [],
    recommendedQuizzes: [],
    stats: {
      totalLearningTime: 0,
      completionRate: 0,
      averageScore: 0,
      impactMetrics: {
        treesPlanted: 0,
        wasteRecycled: 0,
        energySaved: 0,
        waterSaved: 0
      },
      streakData: {
        current: 0,
        longest: 0,
        weeklyGoal: 7,
        progress: 0
      }
    },
    isLoading: true,
    isRefreshing: false,
    error: null
  })

  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const lastFetchTime = useRef<number>(0)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch all user data from various endpoints
   */
  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!user?.id) return

    try {
      setData(prev => ({ ...prev, isRefreshing: true, error: null }))

      // Check if we need to fetch (cache check)
      const now = Date.now()
      if (now - lastFetchTime.current < CACHE_DURATION && data.userProgress) {
        setData(prev => ({ ...prev, isRefreshing: false }))
        return
      }

      const userId = user.id

      // Fetch all data in parallel
      const [
        userProgress,
        availableBadges,
        userBadges,
        activityFeed,
        globalLeaderboard,
        weeklyLeaderboard,
        availableQuizzes,
        userRanking
      ] = await Promise.allSettled([
        fetch(`/api/user/progress?userId=${userId}`).then(res => res.ok ? res.json() : null),
        fetch(`/api/badges`).then(res => res.ok ? res.json() : []),
        fetch(`/api/user/badges?userId=${userId}`).then(res => res.ok ? res.json() : []),
        fetch(`/api/user/activity?userId=${userId}&limit=20`).then(res => res.ok ? res.json() : []),
        fetch(`/api/leaderboard/global?limit=50`).then(res => res.ok ? res.json() : []),
        fetch(`/api/leaderboard/weekly?limit=50`).then(res => res.ok ? res.json() : []),
        fetch(`/api/quizzes?userId=${userId}`).then(res => res.ok ? res.json() : []),
        fetch(`/api/user/ranking?userId=${userId}`).then(res => res.ok ? res.json() : { global: 0, weekly: 0, percentile: 0 })
      ])

      // Process results
      const progressData = userProgress.status === 'fulfilled' ? userProgress.value : null
      const badgesData = availableBadges.status === 'fulfilled' ? availableBadges.value : []
      const userBadgesData = userBadges.status === 'fulfilled' ? userBadges.value : []
      const activityData = activityFeed.status === 'fulfilled' ? activityFeed.value : []
      const globalLeaderData = globalLeaderboard.status === 'fulfilled' ? globalLeaderboard.value : []
      const weeklyLeaderData = weeklyLeaderboard.status === 'fulfilled' ? weeklyLeaderboard.value : []
      const quizzesData = availableQuizzes.status === 'fulfilled' ? availableQuizzes.value : []
      const rankingData = userRanking.status === 'fulfilled' ? userRanking.value : { global: 0, weekly: 0, percentile: 0 }

      // Process badge progress
      const badgeProgress = new Map<string, number>()
      if (progressData && badgesData.length > 0) {
        for (const badge of badgesData) {
          const progress = await calculateBadgeProgress(badge, progressData, userBadgesData)
          badgeProgress.set(badge.id, progress)
        }
      }

      // Separate completed and available quizzes
      const completedQuizzes = quizzesData.filter((q: QuizData) => q.isCompleted)
      const availableQuizzesFiltered = quizzesData.filter((q: QuizData) => !q.isCompleted)

      // Get recent badges (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const recentBadges = userBadgesData.filter((badge: UserBadge) => 
        new Date(badge.earnedAt) > weekAgo
      )

      // Get recent achievements
      const recentAchievements = activityData
        .filter((item: ActivityFeedItem) => 
          ['badge_earned', 'level_up', 'streak_milestone'].includes(item.activityType)
        )
        .slice(0, 5)

      // Calculate stats
      const stats = {
        totalLearningTime: progressData?.totalLearningTimeMinutes || 0,
        completionRate: completedQuizzes.length > 0 ? (completedQuizzes.length / (completedQuizzes.length + availableQuizzesFiltered.length)) * 100 : 0,
        averageScore: progressData?.averageQuizScore || 0,
        impactMetrics: {
          treesPlanted: progressData?.treesPlanted || 0,
          wasteRecycled: progressData?.wasteRecycledKg || 0,
          energySaved: progressData?.energySavedKwh || 0,
          waterSaved: progressData?.waterSavedLiters || 0
        },
        streakData: {
          current: progressData?.currentStreak || 0,
          longest: progressData?.longestStreak || 0,
          weeklyGoal: 7,
          progress: ((progressData?.currentStreak || 0) / 7) * 100
        }
      }

      // Get recommended quizzes based on user's interests/completed topics
      const recommendedQuizzes = getRecommendedQuizzes(availableQuizzesFiltered, completedQuizzes, progressData)

      setData(prev => ({
        ...prev,
        userProgress: progressData,
        availableBadges: badgesData,
        userBadges: userBadgesData,
        recentBadges,
        badgeProgress,
        activityFeed: activityData,
        recentAchievements,
        globalLeaderboard: globalLeaderData,
        weeklyLeaderboard: weeklyLeaderData,
        userRanking: rankingData,
        availableQuizzes: availableQuizzesFiltered,
        completedQuizzes,
        recommendedQuizzes,
        stats,
        isLoading: false,
        isRefreshing: false,
        error: null
      }))

      lastFetchTime.current = now

    } catch (error) {
      console.error('Error fetching user data:', error)
      setData(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to load user data'
      }))
    }
  }, [user?.id, data.userProgress])

  /**
   * Calculate badge progress for a specific badge
   */
  const calculateBadgeProgress = async (badge: Badge, userProgress: UserProgress, userBadges: UserBadge[]): Promise<number> => {
    // Check if already earned
    if (userBadges.some(b => b.badgeId === badge.id)) return 100

    // Calculate progress based on criteria
    switch (badge.criteriaType) {
      case 'points':
        return Math.min((userProgress.totalPoints / badge.criteriaTarget) * 100, 100)
      case 'lessons':
        return Math.min((userProgress.lessonsCompleted / badge.criteriaTarget) * 100, 100)
      case 'tasks':
        return Math.min((userProgress.tasksCompleted / badge.criteriaTarget) * 100, 100)
      case 'streak':
        return Math.min((Math.max(userProgress.currentStreak, userProgress.longestStreak) / badge.criteriaTarget) * 100, 100)
      case 'quiz_score':
        return Math.min((userProgress.averageQuizScore / badge.criteriaTarget) * 100, 100)
      default:
        return 0
    }
  }

  /**
   * Get recommended quizzes based on user behavior
   */
  const getRecommendedQuizzes = (available: QuizData[], completed: QuizData[], progress: UserProgress | null): QuizData[] => {
    if (!progress || available.length === 0) return available.slice(0, 3)

    // Simple recommendation: prioritize by difficulty and category variety
    const sortedQuizzes = available.sort((a, b) => {
      // Prioritize medium difficulty
      const difficultyScore = (quiz: QuizData) => {
        switch (quiz.difficulty) {
          case 'easy': return progress.averageQuizScore < 70 ? 3 : 1
          case 'medium': return 2
          case 'hard': return progress.averageQuizScore > 80 ? 3 : 0
          default: return 1
        }
      }
      
      return difficultyScore(b) - difficultyScore(a)
    })

    return sortedQuizzes.slice(0, 3)
  }

  /**
   * Update user progress after an activity
   */
  const updateProgress = useCallback(async (activityType: string, activityData: any): Promise<void> => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          activityType,
          data: activityData
        })
      })

      if (response.ok) {
        // Refresh data after update
        setTimeout(fetchUserData, 1000)
        
        // Show success toast
        toast.success(`Progress updated! +${activityData.points || 0} points`)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }, [user?.id, fetchUserData])

  /**
   * Complete a quiz
   */
  const completeQuiz = useCallback(async (quizId: string, score: number, answers: any[]): Promise<void> => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          quizId,
          score,
          answers,
          completedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update progress
        await updateProgress('quiz', {
          points: result.pointsEarned,
          quizScore: score,
          quizId
        })

        toast.success(`Quiz completed! Score: ${score}% (+${result.pointsEarned} points)`)
        
        // Check for new badges
        setTimeout(() => {
          fetchUserData()
        }, 2000)
      }
    } catch (error) {
      console.error('Error completing quiz:', error)
      toast.error('Failed to save quiz results')
    }
  }, [user?.id, updateProgress, fetchUserData])

  /**
   * Complete a task
   */
  const completeTask = useCallback(async (taskId: string, impact?: any): Promise<void> => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/task/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          taskId,
          impact,
          completedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        await updateProgress('task', {
          points: result.pointsEarned,
          taskCategory: result.category,
          environmentalImpact: impact
        })

        toast.success(`Task completed! +${result.pointsEarned} points`)
      }
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error('Failed to complete task')
    }
  }, [user?.id, updateProgress])

  /**
   * Manually earn a badge (for testing or special cases)
   */
  const earnBadge = useCallback(async (badgeId: string): Promise<void> => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/badges/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          badgeId
        })
      })

      if (response.ok) {
        const badge = await response.json()
        toast.success(`Badge earned: ${badge.name}!`)
        
        setTimeout(fetchUserData, 1000)
      }
    } catch (error) {
      console.error('Error earning badge:', error)
      toast.error('Failed to earn badge')
    }
  }, [user?.id, fetchUserData])

  /**
   * Manual refresh function
   */
  const refreshData = useCallback(async (): Promise<void> => {
    lastFetchTime.current = 0 // Force refresh
    await fetchUserData()
  }, [fetchUserData])

  // Initial data fetch
  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchUserData()
    }
  }, [isLoaded, user?.id, fetchUserData])

  // Setup polling for real-time updates
  useEffect(() => {
    if (!user?.id) return

    // Poll every 2 minutes when tab is active
    const startPolling = () => {
      pollingInterval.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchUserData()
        }
      }, 2 * 60 * 1000)
    }

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became active - fetch fresh data
        fetchUserData()
        startPolling()
      } else {
        // Tab became inactive - stop polling
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
          pollingInterval.current = null
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    startPolling()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [user?.id, fetchUserData])

  return {
    userProgress: data.userProgress || null,
    availableBadges: data.availableBadges || [],
    userBadges: data.userBadges || [],
    recentBadges: data.recentBadges || [],
    badgeProgress: data.badgeProgress || new Map(),
    activityFeed: data.activityFeed || [],
    recentAchievements: data.recentAchievements || [],
    globalLeaderboard: data.globalLeaderboard || [],
    weeklyLeaderboard: data.weeklyLeaderboard || [],
    userRanking: data.userRanking || { global: 0, weekly: 0, percentile: 0 },
    availableQuizzes: data.availableQuizzes || [],
    completedQuizzes: data.completedQuizzes || [],
    recommendedQuizzes: data.recommendedQuizzes || [],
    stats: data.stats || {
      totalLearningTime: 0,
      completionRate: 0,
      averageScore: 0,
      impactMetrics: {
        treesPlanted: 0,
        wasteRecycled: 0,
        energySaved: 0,
        waterSaved: 0
      },
      streakData: {
        current: 0,
        longest: 0,
        weeklyGoal: 7,
        progress: 0
      }
    },
    isLoading: data.isLoading ?? true,
    isRefreshing: data.isRefreshing ?? false,
    error: data.error ?? null,
    refreshData,
    updateProgress,
    completeQuiz,
    completeTask,
    earnBadge
  }
}
