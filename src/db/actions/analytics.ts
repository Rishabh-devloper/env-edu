'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { pointsLog, userProgress, userCompletedLessons, users } from '../schema'
import { eq, desc, sql, count } from 'drizzle-orm'
import { randomUUID } from 'crypto'

// Get points history for current user
export async function getPointsHistory(limit: number = 20, userId?: string) {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) throw new Error('Unauthorized')
  
  // If userId is provided and different from current user, check if current user is admin
  const targetUserId = userId || currentUserId
  if (userId && userId !== currentUserId) {
    // TODO: Add admin role check here
  }

  const history = await db
    .select()
    .from(pointsLog)
    .where(eq(pointsLog.userId, targetUserId))
    .orderBy(desc(pointsLog.createdAt))
    .limit(limit)

  return history
}

// Get user stats summary
export async function getUserStats(userId?: string) {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) throw new Error('Unauthorized')
  
  // If userId is provided and different from current user, check if current user is admin
  const targetUserId = userId || currentUserId
  if (userId && userId !== currentUserId) {
    // TODO: Add admin role check here
  }

  // Get user progress
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, targetUserId))
  if (!progress) throw new Error('User progress not found')

  // Get total points earned
  const [pointsResult] = await db
    .select({ total: sql<number>`sum(${pointsLog.delta})` })
    .from(pointsLog)
    .where(eq(pointsLog.userId, targetUserId))

  // Get points by activity type
  const pointsByActivity = await db
    .select({
      activityType: pointsLog.activityType,
      total: sql<number>`sum(${pointsLog.delta})`,
      count: count(),
    })
    .from(pointsLog)
    .where(eq(pointsLog.userId, targetUserId))
    .groupBy(pointsLog.activityType)

  // Get completed lessons count
  const [completedResult] = await db
    .select({ count: count() })
    .from(userCompletedLessons)
    .where(eq(userCompletedLessons.userId, targetUserId))

  return {
    totalPoints: progress.totalPoints,
    level: progress.level,
    badges: progress.badges,
    streak: progress.streak,
    completedLessons: completedResult?.count || 0,
    pointsByActivity,
  }
}

// Get leaderboard with different scopes (class, school, global)
export async function getLeaderboard(scope: 'class' | 'school' | 'global' = 'global', limit: number = 10) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Get current user to determine class/school if needed
  const [currentUser] = await db.select().from(users).where(eq(users.id, userId))
  
  // Base query
  let query = db
    .select({
      userId: userProgress.userId,
      totalPoints: userProgress.totalPoints,
      level: userProgress.level,
      badges: userProgress.badges,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
    })
    .from(userProgress)
    .innerJoin(users, eq(userProgress.userId, users.id))
    .orderBy(desc(userProgress.totalPoints))
    .limit(limit)

  // Apply scope filters if needed (this would require additional fields in the users table)
  // For now, we'll just return the global leaderboard
  
  const leaderboard = await query
  
  // Calculate ranks
  const rankedLeaderboard = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    // Create a display name from firstName and lastName
    userName: `${entry.firstName || ''} ${entry.lastName || ''}`.trim() || `User-${entry.userId.substring(0, 8)}`,
    // Convert badges from JSON to array length
    badgesCount: Array.isArray(entry.badges) ? entry.badges.length : 0,
  }))

  return rankedLeaderboard
}

// Add points to a user
export async function addPoints(points: number, reason: string, activityType: string = 'general', activityId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Get current user progress
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  if (!progress) throw new Error('User progress not found')

  // Update user progress and log points in a transaction
  await db.transaction(async (tx) => {
    // Update user progress
    await tx
      .update(userProgress)
      .set({
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
      reason,
      activityType,
      activityId,
      createdAt: new Date(),
    })
  })

  return { success: true, points }
}

// Get user progress
export async function getProgress(userId?: string) {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) throw new Error('Unauthorized')
  
  // If userId is provided and different from current user, check if current user is admin
  const targetUserId = userId || currentUserId
  if (userId && userId !== currentUserId) {
    // TODO: Add admin role check here
  }

  // Get user progress
  const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, targetUserId))
  if (!progress) throw new Error('User progress not found')

  return progress
}