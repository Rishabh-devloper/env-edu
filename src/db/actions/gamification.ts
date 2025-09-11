'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { 
  badges, 
  userBadges, 
  userStreaks, 
  notifications, 
  userProgress,
  pointsLog
} from '../schema'
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { 
  SelectBadge, 
  InsertUserBadge, 
  InsertNotification, 
  BadgeCriteria,
  NotificationData 
} from '../schema'

// ==================== BADGES ====================

export async function getAllBadges() {
  return await db.select().from(badges).where(eq(badges.isActive, true))
}

export async function getUserBadges() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await db
    .select({
      badge: badges,
      earnedAt: userBadges.earnedAt,
      progress: userBadges.progress
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt))
}

export async function checkAndAwardBadges(userId: string) {
  // Get user's current progress
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  if (!progress) return []

  // Get all available badges
  const availableBadges = await db.select().from(badges).where(eq(badges.isActive, true))
  
  // Get user's existing badges
  const userBadgeIds = await db
    .select({ badgeId: userBadges.badgeId })
    .from(userBadges)
    .where(eq(userBadges.userId, userId))

  const existingBadgeIds = new Set(userBadgeIds.map(b => b.badgeId))
  const newlyEarnedBadges: SelectBadge[] = []

  for (const badge of availableBadges) {
    if (existingBadgeIds.has(badge.id)) continue

    const meetsRequirements = await checkBadgeRequirements(
      userId, 
      badge.criteria, 
      progress
    )

    if (meetsRequirements) {
      // Award the badge
      await db.insert(userBadges).values({
        userId,
        badgeId: badge.id,
      })

      // Create notification
      await createNotification(userId, {
        type: 'achievement',
        title: 'New Badge Earned! 🏆',
        message: `Congratulations! You've earned the "${badge.name}" badge!`,
        data: {
          badgeId: badge.id,
          actionUrl: '/gamification'
        }
      })

      newlyEarnedBadges.push(badge)
    }
  }

  return newlyEarnedBadges
}

async function checkBadgeRequirements(
  userId: string, 
  criteria: BadgeCriteria, 
  progress: any
): Promise<boolean> {
  switch (criteria.type) {
    case 'points':
      return progress.totalPoints >= criteria.target

    case 'lessons':
      return progress.completedLessonsCount >= criteria.target

    case 'streak':
      const [streak] = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId))
      return (streak?.currentStreak || 0) >= criteria.target

    case 'tasks':
      // Count completed tasks (would need task completion table)
      return true // Placeholder

    default:
      return false
  }
}

// ==================== STREAKS ====================

export async function updateUserStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Get or create user streak record
  const [existingStreak] = await db
    .select()
    .from(userStreaks)
    .where(eq(userStreaks.userId, userId))

  if (!existingStreak) {
    // Create new streak record
    await db.insert(userStreaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date(),
      streakMultiplier: 1,
    })
    return { currentStreak: 1, isNewStreak: true }
  }

  const lastActiveDate = new Date(existingStreak.lastActiveDate)
  lastActiveDate.setHours(0, 0, 0, 0)

  if (lastActiveDate.getTime() === today.getTime()) {
    // Already active today
    return { 
      currentStreak: existingStreak.currentStreak, 
      isNewStreak: false 
    }
  }

  let newStreak = 1
  let isNewStreak = false

  if (lastActiveDate.getTime() === yesterday.getTime()) {
    // Consecutive day - continue streak
    newStreak = existingStreak.currentStreak + 1
    isNewStreak = true
  } else {
    // Streak broken - reset to 1
    newStreak = 1
    isNewStreak = true
  }

  const newLongestStreak = Math.max(existingStreak.longestStreak, newStreak)
  
  // Calculate streak multiplier (bonus every 7 days)
  const multiplier = Math.min(Math.floor(newStreak / 7) + 1, 3)

  await db
    .update(userStreaks)
    .set({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: new Date(),
      streakMultiplier: multiplier,
      updatedAt: new Date(),
    })
    .where(eq(userStreaks.userId, userId))

  // Award streak milestone badges
  if (newStreak % 7 === 0 && newStreak >= 7) {
    await createNotification(userId, {
      type: 'streak',
      title: `🔥 ${newStreak} Day Streak!`,
      message: `Amazing! You've maintained a ${newStreak}-day learning streak!`,
      data: {
        streak: newStreak,
        multiplier: multiplier,
        actionUrl: '/gamification'
      }
    })
  }

  return { currentStreak: newStreak, isNewStreak, multiplier }
}

export async function getUserStreak(userId: string) {
  const [streak] = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId))
  return streak || {
    currentStreak: 0,
    longestStreak: 0,
    streakMultiplier: 1
  }
}

// ==================== NOTIFICATIONS ====================

export async function createNotification(
  userId: string, 
  notification: Omit<InsertNotification, 'id' | 'userId' | 'createdAt'>
) {
  const id = randomUUID()
  await db.insert(notifications).values({
    id,
    userId,
    ...notification,
  })
  return id
}

export async function getUserNotifications(limit = 50) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
}

export async function markNotificationAsRead(notificationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
}

export async function markAllNotificationsAsRead() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    )
}

export async function getUnreadNotificationCount() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    )

  return result.count || 0
}

// ==================== ACTIVITY TRACKING ====================

export async function trackActivity(
  userId: string, 
  activityType: string, 
  points: number, 
  metadata?: any
) {
  // Update streak
  const streakInfo = await updateUserStreak(userId)
  
  // Apply streak multiplier to points
  const finalPoints = Math.floor(points * streakInfo.multiplier)
  
  // Add points with multiplier
  await db.execute(
    sql`UPDATE ${userProgress} 
        SET total_points = total_points + ${finalPoints}, 
            level = floor((total_points + ${finalPoints})/100) + 1, 
            updated_at = now() 
        WHERE user_id = ${userId}`
  )
  
  // Log the activity
  await db.insert(pointsLog).values({
    id: randomUUID(),
    userId,
    delta: finalPoints,
    reason: `${activityType} (${streakInfo.multiplier}x streak bonus)`,
    activityType,
    activityId: metadata?.id,
  })
  
  // Check for new badges
  const newBadges = await checkAndAwardBadges(userId)
  
  // Create level up notification if applicable
  const [updatedProgress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  const newLevel = updatedProgress?.level || 1
  const oldLevel = Math.floor((updatedProgress?.totalPoints || 0 - finalPoints) / 100) + 1
  
  if (newLevel > oldLevel) {
    await createNotification(userId, {
      type: 'level_up',
      title: `🎉 Level ${newLevel} Achieved!`,
      message: `Congratulations! You've reached level ${newLevel}!`,
      data: {
        level: newLevel,
        points: finalPoints,
        actionUrl: '/gamification'
      }
    })
  }
  
  return {
    pointsEarned: finalPoints,
    streakMultiplier: streakInfo.multiplier,
    newBadges,
    levelUp: newLevel > oldLevel,
    newLevel: newLevel > oldLevel ? newLevel : undefined
  }
}
