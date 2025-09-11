'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export interface UserProgress {
  totalPoints: number
  level: number
  completedLessons: string[]
  completedTasks: string[]
  badges: string[]
  totalLessons: number
  streak: number
  completionRate: number
  nextLevelPoints: number
  rank: number
  schoolRank?: number
}

export interface Task {
  id: string
  title: string
  description: string
  category: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  instructions: string[]
  submissionType: 'photo' | 'text' | 'both'
  status: 'available' | 'in-progress' | 'completed' | 'under-review'
  createdAt: string
  submittedAt?: string
  submissionData?: {
    images?: string[]
    text?: string
    reviewStatus?: 'pending' | 'approved' | 'rejected'
    reviewNotes?: string
  }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt?: string
  progress?: number
  required?: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  points: number
  level: number
  rank: number
  badge?: string
  school?: string
  class?: string
}

// Hook for user progress data
export function useUserProgress() {
  const { user, isLoaded } = useUser()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProgress()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchUserProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/progress')
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress || getDefaultProgress())
      } else {
        setProgress(getDefaultProgress())
      }
    } catch (err) {
      console.error('Error fetching user progress:', err)
      setError('Failed to load progress')
      setProgress(getDefaultProgress())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultProgress = (): UserProgress => ({
    totalPoints: 0,
    level: 1,
    completedLessons: [],
    completedTasks: [],
    badges: [],
    totalLessons: 25,
    streak: 0,
    completionRate: 0,
    nextLevelPoints: 100,
    rank: 0
  })

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    setProgress(prev => prev ? { ...prev, ...newProgress } : getDefaultProgress())
  }

  return { progress, loading, error, refetch: fetchUserProgress, updateProgress }
}

// Hook for tasks data
export function useTasks() {
  const { user, isLoaded } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchTasks()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || getDefaultTasks())
      } else {
        setTasks(getDefaultTasks())
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks')
      setTasks(getDefaultTasks())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultTasks = (): Task[] => [
    {
      id: '1',
      title: 'Plant a Tree in Your Neighborhood',
      description: 'Plant a sapling and document its growth over time',
      category: 'conservation',
      points: 200,
      difficulty: 'medium',
      estimatedTime: '2-3 hours',
      instructions: [
        'Choose a suitable location with proper sunlight',
        'Dig a hole twice the width of the root ball',
        'Plant the sapling at the right depth',
        'Water thoroughly and add mulch',
        'Take before and after photos'
      ],
      submissionType: 'photo',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Document Local Pollution',
      description: 'Identify and report environmental issues in your area',
      category: 'awareness',
      points: 150,
      difficulty: 'easy',
      estimatedTime: '1 hour',
      instructions: [
        'Walk around your neighborhood',
        'Take photos of pollution sources',
        'Note the location and type of pollution',
        'Suggest possible solutions',
        'Share findings with local authorities'
      ],
      submissionType: 'both',
      status: 'available',
      createdAt: new Date().toISOString()
    }
  ]

  const submitTask = async (taskId: string, submissionData: { images?: File[], text?: string }) => {
    try {
      const formData = new FormData()
      formData.append('taskId', taskId)
      if (submissionData.text) {
        formData.append('text', submissionData.text)
      }
      if (submissionData.images) {
        submissionData.images.forEach((image, index) => {
          formData.append(`image_${index}`, image)
        })
      }

      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'under-review', submittedAt: new Date().toISOString(), submissionData: data.submission }
            : task
        ))
        return { success: true, data }
      } else {
        throw new Error('Failed to submit task')
      }
    } catch (err) {
      console.error('Error submitting task:', err)
      return { success: false, error: 'Failed to submit task' }
    }
  }

  return { tasks, loading, error, refetch: fetchTasks, submitTask }
}

// Hook for badges data
export function useBadges() {
  const { user, isLoaded } = useUser()
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchBadges()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchBadges = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/badges')
      if (response.ok) {
        const data = await response.json()
        setBadges(data.allBadges || getDefaultBadges())
        setEarnedBadges(data.earnedBadges || [])
      } else {
        setBadges(getDefaultBadges())
      }
    } catch (err) {
      console.error('Error fetching badges:', err)
      setBadges(getDefaultBadges())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultBadges = (): Badge[] => [
    {
      id: 'tree-planter',
      name: 'Tree Planter',
      description: 'Plant your first tree',
      icon: '🌱',
      rarity: 'common',
      required: 1
    },
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Complete 10 environmental tasks',
      icon: '🛡️',
      rarity: 'rare',
      required: 10
    },
    {
      id: 'pollution-reporter',
      name: 'Pollution Reporter',
      description: 'Report 5 pollution incidents',
      icon: '📸',
      rarity: 'common',
      required: 5
    }
  ]

  return { badges, earnedBadges, loading, refetch: fetchBadges }
}

// Hook for leaderboard data
export function useLeaderboard(type: 'school' | 'global' | 'class' = 'global') {
  const { user, isLoaded } = useUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      fetchLeaderboard()
    }
  }, [isLoaded, type])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || getDefaultLeaderboard())
        setUserRank(data.userRank || 0)
      } else {
        setLeaderboard(getDefaultLeaderboard())
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setLeaderboard(getDefaultLeaderboard())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultLeaderboard = (): LeaderboardEntry[] => [
    {
      id: '1',
      name: 'Arjun Sharma',
      points: 2450,
      level: 12,
      rank: 1,
      badge: '🛡️',
      school: 'Delhi Public School',
      class: '10-A'
    },
    {
      id: '2', 
      name: 'Priya Patel',
      points: 2180,
      level: 11,
      rank: 2,
      badge: '🌱',
      school: 'Kendriya Vidyalaya',
      class: '10-B'
    }
  ]

  return { leaderboard, userRank, loading, refetch: fetchLeaderboard }
}
