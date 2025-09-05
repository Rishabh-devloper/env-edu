'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

interface PointsContextType {
  totalPoints: number
  level: number
  badges: string[]
  addPoints: (points: number, reason: string) => void
  addBadge: (badgeId: string) => void
  isLoading: boolean
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export function PointsProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load user points from localStorage or API
  useEffect(() => {
    if (isLoaded && user) {
      const savedPoints = localStorage.getItem(`points_${user.id}`)
      const savedBadges = localStorage.getItem(`badges_${user.id}`)
      
      if (savedPoints) {
        const points = parseInt(savedPoints)
        setTotalPoints(points)
        setLevel(Math.floor(points / 100) + 1)
      }
      
      if (savedBadges) {
        setBadges(JSON.parse(savedBadges))
      }
      
      setIsLoading(false)
    }
  }, [isLoaded, user])

  const addPoints = (points: number, reason: string) => {
    if (!user) return
    
    setTotalPoints(prev => {
      const newPoints = prev + points
      const newLevel = Math.floor(newPoints / 100) + 1
      
      // Save to localStorage
      localStorage.setItem(`points_${user.id}`, newPoints.toString())
      
      // Check for level up
      if (newLevel > level) {
        setLevel(newLevel)
        console.log(`Level up! You're now level ${newLevel}`)
      }
      
      console.log(`Earned ${points} points for: ${reason}`)
      return newPoints
    })
  }

  const addBadge = (badgeId: string) => {
    if (!user) return
    
    setBadges(prev => {
      if (!prev.includes(badgeId)) {
        const newBadges = [...prev, badgeId]
        localStorage.setItem(`badges_${user.id}`, JSON.stringify(newBadges))
        console.log(`Earned badge: ${badgeId}`)
        return newBadges
      }
      return prev
    })
  }

  return (
    <PointsContext.Provider value={{
      totalPoints,
      level,
      badges,
      addPoints,
      addBadge,
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
