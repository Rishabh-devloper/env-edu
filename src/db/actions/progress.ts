'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { userProgress, users, userCompletedLessons, pointsLog } from '../schema'
import { eq, and, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function ensureUserRecord() {
  const { userId, sessionClaims } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const email = (sessionClaims && typeof (sessionClaims as Record<string, unknown>).email === 'string')
    ? ((sessionClaims as Record<string, string>).email)
    : ''
  await db
    .insert(users)
    .values({ id: userId, email })
    .onConflictDoNothing({ target: users.id })

  await db
    .insert(userProgress)
    .values({ userId })
    .onConflictDoNothing({ target: userProgress.userId })

  return userId
}

export async function getProgress() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const [row] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  const completedCount = row?.completedLessonsCount ?? 0
  const totalPoints = row?.totalPoints ?? 0
  const level = row?.level ?? 1
  return {
    totalPoints,
    level,
    completedLessonsCount: completedCount,
    badges: row?.badges ?? [],
    streak: row?.streak ?? 0,
  }
}

export async function addPoints(points: number, reason?: string, activity?: { type?: string; id?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await ensureUserRecord()

  // Get current progress to check for level up
  const [currentProgress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  const currentLevel = currentProgress?.level || 1
  const newTotalPoints = (currentProgress?.totalPoints || 0) + points
  const newLevel = Math.floor(newTotalPoints / 100) + 1
  const levelUp = newLevel > currentLevel

  try {
    await db.transaction(async (tx) => {
      await tx.execute(sql`update ${userProgress} set total_points = total_points + ${points}, level = floor((total_points + ${points})/100) + 1, updated_at = now() where user_id = ${userId}`)
      await tx.insert(pointsLog).values({
        id: randomUUID(),
        userId,
        delta: points,
        reason,
        activityType: activity?.type,
        activityId: activity?.id,
      })
    })
  } catch {
    // Fallback for neon-http which doesn't support transactions
    await db.execute(sql`update ${userProgress} set total_points = total_points + ${points}, level = floor((total_points + ${points})/100) + 1, updated_at = now() where user_id = ${userId}`)
    await db.insert(pointsLog).values({
      id: randomUUID(),
      userId,
      delta: points,
      reason,
      activityType: activity?.type,
      activityId: activity?.id,
    })
  }

  const updatedProgress = await getProgress()
  return { ...updatedProgress, levelUp }
}

export async function completeLesson(lessonId: string, points: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await ensureUserRecord()

  // If lesson already completed, do nothing (idempotent)
  const already = await db
    .select()
    .from(userCompletedLessons)
    .where(and(eq(userCompletedLessons.userId, userId), eq(userCompletedLessons.lessonId, lessonId)))

  if (already.length > 0) {
    const snapshot = await getProgress()
    return { ...snapshot, levelUp: false }
  }

  // Get current progress to check for level up
  const [currentProgress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId))
  const currentLevel = currentProgress?.level || 1
  const newTotalPoints = (currentProgress?.totalPoints || 0) + points
  const newLevel = Math.floor(newTotalPoints / 100) + 1
  const levelUp = newLevel > currentLevel

  // Record completion, increment counters and points (with transaction fallback for serverless drivers)
  try {
    await db.transaction(async (tx) => {
      await tx.insert(userCompletedLessons).values({ userId, lessonId }).onConflictDoNothing()
      await tx.execute(sql`update ${userProgress} set completed_lessons_count = completed_lessons_count + 1, total_points = total_points + ${points}, level = floor((total_points + ${points})/100) + 1, updated_at = now() where user_id = ${userId}`)
      await tx.insert(pointsLog).values({ id: randomUUID(), userId, delta: points, reason: 'Completed lesson', activityType: 'lesson', activityId: lessonId })
    })
  } catch {
    // Fallback: best-effort non-transactional ops
    await db.insert(userCompletedLessons).values({ userId, lessonId }).onConflictDoNothing()
    await db.execute(sql`update ${userProgress} set completed_lessons_count = completed_lessons_count + 1, total_points = total_points + ${points}, level = floor((total_points + ${points})/100) + 1, updated_at = now() where user_id = ${userId}`)
    await db.insert(pointsLog).values({ id: randomUUID(), userId, delta: points, reason: 'Completed lesson', activityType: 'lesson', activityId: lessonId })
  }

  const updatedProgress = await getProgress()
  return { ...updatedProgress, levelUp }
}

export async function getCompletedLessons() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const rows = await db.select().from(userCompletedLessons).where(eq(userCompletedLessons.userId, userId))
  return rows.map((r) => r.lessonId)
}


