'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

interface UserProgress {
  totalPoints: number
  level: number
  completedLessons: string[]
  badges: string[]
  totalLessons: number
  streak: number
  completionRate: number
  nextLevelPoints: number
}

interface PointsContextType {
  totalPoints: number
  level: number
  badges: string[]
  completedLessons: string[]
  completionRate: number
  streak: number
  nextLevelPoints: number
  addPoints: (points: number, reason: string, activityType?: string, activityId?: string) => Promise<boolean>
  addBadge: (badgeId: string) => void
  completeLesson: (lessonId: string, points: number) => Promise<boolean>
  isLoading: boolean
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export function PointsProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [completionRate, setCompletionRate] = useState(0)
  const [streak, setStreak] = useState(0)
  const [nextLevelPoints, setNextLevelPoints] = useState(100)
  const [isLoading, setIsLoading] = useState(true)

  // Load user progress from API
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProgress()
    }
  }, [isLoaded, user])

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/progress')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const progress: UserProgress = data.data
          setTotalPoints(progress.totalPoints)
          setLevel(progress.level)
          setBadges(progress.badges)
          setCompletedLessons(progress.completedLessons)
          setCompletionRate(progress.completionRate)
          setStreak(progress.streak)
          setNextLevelPoints(progress.nextLevelPoints)
        }
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Fallback to localStorage for offline support
      const savedPoints = localStorage.getItem(`points_${user?.id}`)
      const savedBadges = localStorage.getItem(`badges_${user?.id}`)
      const savedLessons = localStorage.getItem(`completed_lessons_${user?.id}`)
      
      if (savedPoints) {
        const points = parseInt(savedPoints)
        setTotalPoints(points)
        setLevel(Math.floor(points / 100) + 1)
      }
      
      if (savedBadges) {
        setBadges(JSON.parse(savedBadges))
      }
      
      if (savedLessons) {
        setCompletedLessons(JSON.parse(savedLessons))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addPoints = async (points: number, reason: string, activityType?: string, activityId?: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points,
          reason,
          activityType,
          activityId
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTotalPoints(data.totalPoints)
          setLevel(data.level)
          
          // Show level up notification if applicable
          if (data.leveledUp) {
            console.log(`🎉 Level up! You're now level ${data.level}`)
          }
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error adding points:', error)
      // Fallback to local state update
      setTotalPoints(prev => {
        const newPoints = prev + points
        const newLevel = Math.floor(newPoints / 100) + 1
        setLevel(newLevel)
        return newPoints
      })
      return true // Consider fallback as success
    }
  }

  const completeLesson = async (lessonId: string, points: number): Promise<boolean> => {
    if (!user || completedLessons.includes(lessonId)) return false
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete_lesson',
          lessonId,
          points
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTotalPoints(data.data.totalPoints)
          setLevel(data.data.level)
          setCompletedLessons(data.data.completedLessons)
          setCompletionRate(data.data.completionRate)
          
          // Show level up notification if applicable
          if (data.data.leveledUp) {
            console.log(`🎉 Level up! You're now level ${data.data.level}`)
          }
          
          return true
        }
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
      // Fallback to local state update
      setCompletedLessons(prev => [...prev, lessonId])
      setTotalPoints(prev => prev + points)
      const newLevel = Math.floor((totalPoints + points) / 100) + 1
      setLevel(newLevel)
      return true
    }
    
    return false
  }

  const addBadge = async (badgeId: string) => {
    if (!user || badges.includes(badgeId)) return
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_badge',
          badgeId
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBadges(data.data.badges)
        }
      }
    } catch (error) {
      console.error('Error adding badge:', error)
      // Fallback to local state update
      setBadges(prev => [...prev, badgeId])
    }
  }

  return (
    <PointsContext.Provider value={{
      totalPoints,
      level,
      badges,
      completedLessons,
      completionRate,
      streak,
      nextLevelPoints,
      addPoints,
      addBadge,
      completeLesson,
      isLoading
    }}>
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider')
  }
  return context
}
