'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { userProgress, pointsLog } from '../schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

// Add a badge to user's collection
export async function addBadge(badgeId: string, points: number = 10) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Get current badges
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  if (!progress) throw new Error('User progress not found')

  // Check if badge already exists
  const currentBadges = progress.badges as string[]
  if (currentBadges.includes(badgeId)) {
    return { success: false, message: 'Badge already earned' }
  }

  // Add badge and points in a transaction
  await db.transaction(async (tx) => {
    // Add badge to array
    const updatedBadges = [...currentBadges, badgeId]
    
    // Update user progress
    await tx
      .update(userProgress)
      .set({
        badges: updatedBadges as any,
        totalPoints: progress.totalPoints + points,
        level: Math.floor((progress.totalPoints + points) / 100) + 1,
        updatedAt: new Date(),
      })
      .where(eq(userProgress.userId, userId))

    // Log points
    await tx.insert(pointsLog).values({
      id: randomUUID(),
      userId,
      delta: points,
      reason: `Earned badge: ${badgeId}`,
      activityType: 'badge',
      activityId: badgeId,
    })
  })

  return { success: true, message: 'Badge added successfully' }
}

// Get all badges for a user
export async function getUserBadges(userId?: string) {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) throw new Error('Unauthorized')
  
  // If userId is provided and different from current user, check if current user is admin
  const targetUserId = userId || currentUserId
  if (userId && userId !== currentUserId) {
    // TODO: Add admin role check here
  }

  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, targetUserId))
  if (!progress) return []

  return progress.badges as string[]
}

// Get all available badges with metadata
export async function getAllBadges() {
  // In a real application, this would come from a database table
  // For now, we'll return a static list of badges with metadata
  return [
    {
      id: 'eco_warrior',
      name: 'Eco Warrior',
      description: 'Complete your first environmental task',
      icon: '🌱',
      pointsRequired: 100,
      category: 'eco_action',
      rarity: 'common'
    },
    {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      icon: '📚',
      pointsRequired: 250,
      category: 'knowledge',
      rarity: 'rare'
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Help 10 other students',
      icon: '👥',
      pointsRequired: 500,
      category: 'leadership',
      rarity: 'epic'
    },
    {
      id: 'climate_champion',
      name: 'Climate Champion',
      description: 'Earn 1000 eco-points',
      icon: '🏆',
      pointsRequired: 1000,
      category: 'community',
      rarity: 'legendary'
    },
    {
      id: 'recycling_master',
      name: 'Recycling Master',
      description: 'Complete all recycling tasks',
      icon: '♻️',
      pointsRequired: 300,
      category: 'eco_action',
      rarity: 'rare'
    },
    {
      id: 'quiz_expert',
      name: 'Quiz Expert',
      description: 'Score 90%+ on 10 quizzes',
      icon: '🧠',
      pointsRequired: 400,
      category: 'knowledge',
      rarity: 'epic'
    }
  ]
}

// Check if user has earned a specific badge
export async function checkBadgeEligibility(badgeId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Get user progress
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  if (!progress) throw new Error('User progress not found')

  // Check if badge is already earned
  const currentBadges = progress.badges as string[]
  if (currentBadges.includes(badgeId)) {
    return { eligible: false, reason: 'Badge already earned' }
  }

  // Get badge metadata
  const allBadges = await getAllBadges()
  const badge = allBadges.find(b => b.id === badgeId)
  if (!badge) {
    return { eligible: false, reason: 'Badge not found' }
  }

  // Check eligibility based on badge criteria
  // This would be more complex in a real application
  if (progress.totalPoints >= badge.pointsRequired) {
    return { eligible: true }
  }

  return { 
    eligible: false, 
    reason: `Need ${badge.pointsRequired - progress.totalPoints} more points`, 
    currentPoints: progress.totalPoints,
    requiredPoints: badge.pointsRequired
  }
}