'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { 
  leaderboards, 
  users,
  userProgress,
  userBadges,
  userSchools,
  schools
} from '../schema'
import { eq, and, desc, sql, gte, lte, inArray } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { 
  LeaderboardData,
  InsertLeaderboard,
  SelectLeaderboard
} from '../schema'

// ==================== LEADERBOARD GENERATION ====================

export async function generateLeaderboard(
  type: 'daily' | 'weekly' | 'monthly' | 'all_time',
  scope: 'global' | 'school' | 'class',
  scopeId?: string,
  limit = 100
) {
  const leaderboardId = `${type}_${scope}_${scopeId || 'global'}`
  
  let timeFilter: Date | undefined
  const now = new Date()
  
  // Calculate time range based on type
  switch (type) {
    case 'daily':
      timeFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'weekly':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)
      timeFilter = weekStart
      break
    case 'monthly':
      timeFilter = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'all_time':
      // No time filter for all-time leaderboard
      break
  }

  // Base query for user progress with user details
  let query = db
    .select({
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      totalPoints: userProgress.totalPoints,
      level: userProgress.level,
      school: schools.name,
    })
    .from(userProgress)
    .innerJoin(users, eq(userProgress.userId, users.id))
    .leftJoin(userSchools, eq(users.id, userSchools.userId))
    .leftJoin(schools, eq(userSchools.schoolId, schools.id))
    .$dynamic()

  // Add scope filters
  if (scope === 'school' && scopeId) {
    query = query.where(eq(userSchools.schoolId, scopeId))
  } else if (scope === 'class' && scopeId) {
    // Assuming scopeId for class is "schoolId:className"
    const [schoolId, className] = scopeId.split(':')
    query = query.where(
      and(
        eq(userSchools.schoolId, schoolId),
        eq(userSchools.className, className)
      )
    )
  }

  // For time-based leaderboards, we need to calculate points within the timeframe
  if (timeFilter && type !== 'all_time') {
    // This would require a more complex query to sum points from pointsLog
    // within the specified time range. For now, using total points as approximation
    query = query.orderBy(desc(userProgress.totalPoints)).limit(limit)
  } else {
    query = query.orderBy(desc(userProgress.totalPoints)).limit(limit)
  }

  const results = await query

  // Get badge counts for each user
  const userIds = results.map(r => r.userId)
  const badgeCounts = await db
    .select({
      userId: userBadges.userId,
      count: sql<number>`count(*)`
    })
    .from(userBadges)
    .where(inArray(userBadges.userId, userIds))
    .groupBy(userBadges.userId)

  const badgeCountMap = new Map(badgeCounts.map(bc => [bc.userId, bc.count]))

  // Format leaderboard data
  const entries = results.map((result, index) => ({
    userId: result.userId,
    userName: `${result.firstName || ''} ${result.lastName || ''}`.trim() || 'Anonymous',
    points: result.totalPoints || 0,
    level: result.level || 1,
    rank: index + 1,
    school: result.school || undefined,
    badges: badgeCountMap.get(result.userId) || 0,
  }))

  const leaderboardData: LeaderboardData = {
    entries,
    totalParticipants: entries.length,
    lastCalculated: new Date().toISOString(),
  }

  // Cache the leaderboard
  await db
    .insert(leaderboards)
    .values({
      id: leaderboardId,
      type,
      scope,
      scopeId,
      data: leaderboardData,
    })
    .onConflictDoUpdate({
      target: leaderboards.id,
      set: {
        data: leaderboardData,
        lastUpdated: new Date(),
      }
    })

  return leaderboardData
}

// ==================== LEADERBOARD RETRIEVAL ====================

export async function getLeaderboard(
  type: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time',
  scope: 'global' | 'school' | 'class' = 'global',
  scopeId?: string,
  forceRefresh = false
) {
  const leaderboardId = `${type}_${scope}_${scopeId || 'global'}`
  
  if (!forceRefresh) {
    // Try to get cached leaderboard
    const [cached] = await db
      .select()
      .from(leaderboards)
      .where(eq(leaderboards.id, leaderboardId))

    // Check if cache is still valid (refresh every hour)
    if (cached) {
      const cacheAge = Date.now() - new Date(cached.lastUpdated).getTime()
      const cacheValidFor = 60 * 60 * 1000 // 1 hour
      
      if (cacheAge < cacheValidFor) {
        return cached.data
      }
    }
  }

  // Generate fresh leaderboard
  return await generateLeaderboard(type, scope, scopeId)
}

export async function getUserRank(
  userId: string,
  type: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time',
  scope: 'global' | 'school' | 'class' = 'global',
  scopeId?: string
) {
  const leaderboardData = await getLeaderboard(type, scope, scopeId)
  const userEntry = leaderboardData.entries.find(entry => entry.userId === userId)
  
  return {
    rank: userEntry?.rank || null,
    totalParticipants: leaderboardData.totalParticipants,
    percentile: userEntry ? 
      Math.round(((leaderboardData.totalParticipants - userEntry.rank + 1) / leaderboardData.totalParticipants) * 100) : 
      null
  }
}

// ==================== COMPETITIVE FEATURES ====================

export async function getUsersNearby(
  userId: string,
  range = 5,
  type: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time'
) {
  const leaderboardData = await getLeaderboard(type, 'global')
  const userIndex = leaderboardData.entries.findIndex(entry => entry.userId === userId)
  
  if (userIndex === -1) return []
  
  const start = Math.max(0, userIndex - range)
  const end = Math.min(leaderboardData.entries.length, userIndex + range + 1)
  
  return leaderboardData.entries.slice(start, end)
}

export async function getTopPerformers(
  category: 'points' | 'badges' | 'level' = 'points',
  limit = 10,
  timeframe: 'day' | 'week' | 'month' | 'all_time' = 'all_time'
) {
  // Get appropriate leaderboard type
  const type = timeframe === 'day' ? 'daily' : 
               timeframe === 'week' ? 'weekly' :
               timeframe === 'month' ? 'monthly' : 'all_time'
  
  const leaderboardData = await getLeaderboard(type, 'global')
  
  // Sort by requested category
  const sorted = [...leaderboardData.entries].sort((a, b) => {
    switch (category) {
      case 'badges':
        return b.badges - a.badges
      case 'level':
        return b.level - a.level
      case 'points':
      default:
        return b.points - a.points
    }
  })
  
  return sorted.slice(0, limit)
}

// ==================== SCHOOL COMPETITIONS ====================

export async function getSchoolLeaderboard() {
  // Get all schools with their total points
  const schoolStats = await db
    .select({
      schoolId: schools.id,
      schoolName: schools.name,
      location: schools.location,
      totalPoints: sql<number>`sum(${userProgress.totalPoints})`,
      totalStudents: sql<number>`count(distinct ${users.id})`,
      averagePoints: sql<number>`avg(${userProgress.totalPoints})`,
    })
    .from(schools)
    .innerJoin(userSchools, eq(schools.id, userSchools.schoolId))
    .innerJoin(users, eq(userSchools.userId, users.id))
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .groupBy(schools.id, schools.name, schools.location)
    .orderBy(desc(sql`sum(${userProgress.totalPoints})`))
    .limit(50)

  return schoolStats.map((school, index) => ({
    rank: index + 1,
    schoolId: school.schoolId,
    name: school.schoolName,
    location: school.location,
    totalPoints: school.totalPoints || 0,
    totalStudents: school.totalStudents || 0,
    averagePoints: Math.round(school.averagePoints || 0),
  }))
}

export async function getClassLeaderboard(schoolId: string) {
  const classStats = await db
    .select({
      className: userSchools.className,
      totalPoints: sql<number>`sum(${userProgress.totalPoints})`,
      totalStudents: sql<number>`count(distinct ${users.id})`,
      averagePoints: sql<number>`avg(${userProgress.totalPoints})`,
    })
    .from(userSchools)
    .innerJoin(users, eq(userSchools.userId, users.id))
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .where(and(
      eq(userSchools.schoolId, schoolId),
      sql`${userSchools.className} is not null`
    ))
    .groupBy(userSchools.className)
    .orderBy(desc(sql`avg(${userProgress.totalPoints})`))

  return classStats.map((classData, index) => ({
    rank: index + 1,
    className: classData.className || 'Unknown',
    totalPoints: classData.totalPoints || 0,
    totalStudents: classData.totalStudents || 0,
    averagePoints: Math.round(classData.averagePoints || 0),
  }))
}

// ==================== ANALYTICS ====================

export async function getLeaderboardAnalytics() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Get user's current rankings across different leaderboards
  const [globalRank, schoolRank] = await Promise.all([
    getUserRank(userId, 'all_time', 'global'),
    // Would need to get user's school first for school ranking
    { rank: null, totalParticipants: 0, percentile: null }
  ])

  // Get recent leaderboard movement (would require historical data)
  const recentMovement = {
    daily: 0,    // Change in rank from yesterday
    weekly: 0,   // Change in rank from last week
    monthly: 0   // Change in rank from last month
  }

  return {
    globalRank,
    schoolRank,
    recentMovement,
  }
}

// ==================== REFRESH UTILITIES ====================

export async function refreshAllLeaderboards() {
  // This would typically be run as a cron job
  const types = ['daily', 'weekly', 'monthly', 'all_time'] as const
  const scopes = ['global'] as const // Add school scopes as needed
  
  for (const type of types) {
    for (const scope of scopes) {
      await generateLeaderboard(type, scope, undefined, 100)
    }
  }
}

export async function refreshUserSpecificLeaderboards(userId: string) {
  // Refresh leaderboards specific to user's school/class
  // Implementation would depend on user's affiliations
  
  // For now, just refresh global leaderboards
  await generateLeaderboard('all_time', 'global')
  await generateLeaderboard('weekly', 'global')
  await generateLeaderboard('daily', 'global')
}
