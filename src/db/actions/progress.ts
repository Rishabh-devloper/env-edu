'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { userProgress, users, userCompletedLessons, lessons, pointsLog } from '../schema'
import { eq, and, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function ensureUserRecord() {
  const { userId, sessionClaims } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const email = (sessionClaims as any)?.email || ''
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

  const updatedProgress = await getProgress()
  return { ...updatedProgress, levelUp }
}

export async function completeLesson(lessonId: string, points: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await ensureUserRecord()

  // add completed entry if not exists
  await db.insert(userCompletedLessons).values({ userId, lessonId }).onConflictDoNothing()

  // increase counters and points atomically
  await db.execute(sql`update ${userProgress} set completed_lessons_count = completed_lessons_count + 1, total_points = total_points + ${points}, level = floor((total_points + ${points})/100) + 1, updated_at = now() where user_id = ${userId}`)

  await db.insert(pointsLog).values({ id: randomUUID(), userId, delta: points, reason: 'Completed lesson', activityType: 'lesson', activityId: lessonId })

  return getProgress()
}

export async function getCompletedLessons() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const rows = await db.select().from(userCompletedLessons).where(eq(userCompletedLessons.userId, userId))
  return rows.map((r) => r.lessonId)
}


