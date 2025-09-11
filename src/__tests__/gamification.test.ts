import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { 
  addPointsWithStreakBonus,
  updateUserStreak,
  checkAndAwardBadges,
  getUserBadges,
  createNotification,
  getUnreadNotificationCount,
  markNotificationAsRead
} from '../db/actions/gamification'
import { 
  submitTask,
  getPendingSubmissions,
  reviewSubmission 
} from '../db/actions/tasks'
import {
  generateLeaderboard,
  getUserRank,
  getUsersNearby
} from '../db/actions/leaderboards'
import { db } from '../db'
import { users, userProgress, userBadges, userStreaks, notifications, tasks, taskSubmissions } from '../db/schema'
import { eq } from 'drizzle-orm'

// Test user data
const testUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student',
  schoolId: 'dps-vasant-kunj',
  currentLevel: 1,
  totalEcoPoints: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const testTask = {
  id: 'test-task-1',
  title: 'Test Environmental Task',
  description: 'A test task for environmental action',
  category: 'waste_management',
  difficulty: 'easy',
  ecoPoints: 50,
  estimatedTime: 30,
  requirements: {
    photoRequired: true,
    locationRequired: false,
    descriptionMinLength: 50,
    verificationType: 'auto' as const,
    materials: ['Test materials']
  },
  isActive: true,
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Gamification System Tests', () => {
  beforeEach(async () => {
    // Clean up test data
    await db.delete(notifications).where(eq(notifications.userId, testUser.id))
    await db.delete(userBadges).where(eq(userBadges.userId, testUser.id))
    await db.delete(userStreaks).where(eq(userStreaks.userId, testUser.id))
    await db.delete(taskSubmissions).where(eq(taskSubmissions.userId, testUser.id))
    await db.delete(userProgress).where(eq(userProgress.userId, testUser.id))
    await db.delete(users).where(eq(users.id, testUser.id))
    await db.delete(tasks).where(eq(tasks.id, testTask.id))

    // Insert fresh test data
    await db.insert(users).values(testUser)
    await db.insert(tasks).values(testTask)
  })

  afterEach(async () => {
    // Clean up after tests
    await db.delete(notifications).where(eq(notifications.userId, testUser.id))
    await db.delete(userBadges).where(eq(userBadges.userId, testUser.id))
    await db.delete(userStreaks).where(eq(userStreaks.userId, testUser.id))
    await db.delete(taskSubmissions).where(eq(taskSubmissions.userId, testUser.id))
    await db.delete(userProgress).where(eq(userProgress.userId, testUser.id))
    await db.delete(users).where(eq(users.id, testUser.id))
    await db.delete(tasks).where(eq(tasks.id, testTask.id))
  })

  describe('Points and Streaks', () => {
    it('should add points and update streak correctly', async () => {
      const result = await addPointsWithStreakBonus(testUser.id, 50)
      
      expect(result.success).toBe(true)
      expect(result.pointsEarned).toBeGreaterThanOrEqual(50)
      expect(result.currentStreak).toBeGreaterThan(0)
    })

    it('should update user streak and award multiplier', async () => {
      const streak = await updateUserStreak(testUser.id)
      
      expect(streak.currentStreak).toBeGreaterThan(0)
      expect(streak.multiplier).toBeGreaterThanOrEqual(1.0)
    })

    it('should handle streak reset after inactivity', async () => {
      // First, create a streak
      await updateUserStreak(testUser.id)
      
      // Simulate inactivity by setting lastActivity to 2 days ago
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      
      await db.update(userStreaks)
        .set({ lastActivity: twoDaysAgo })
        .where(eq(userStreaks.userId, testUser.id))
      
      // Update streak again - should reset
      const streak = await updateUserStreak(testUser.id)
      expect(streak.currentStreak).toBe(1) // Reset to 1
    })
  })

  describe('Badge System', () => {
    it('should check and award appropriate badges', async () => {
      // Add some points first
      await addPointsWithStreakBonus(testUser.id, 100)
      
      const badges = await checkAndAwardBadges(testUser.id)
      expect(Array.isArray(badges)).toBe(true)
      
      // Check if any badges were awarded
      const userBadgesList = await getUserBadges(testUser.id)
      expect(Array.isArray(userBadgesList)).toBe(true)
    })

    it('should not award duplicate badges', async () => {
      // Award badges twice with same conditions
      await addPointsWithStreakBonus(testUser.id, 100)
      
      const badges1 = await checkAndAwardBadges(testUser.id)
      const badges2 = await checkAndAwardBadges(testUser.id)
      
      const userBadgesList = await getUserBadges(testUser.id)
      
      // Should not have duplicate badges for same criteria
      const badgeIds = userBadgesList.map(b => b.badgeId)
      const uniqueBadgeIds = [...new Set(badgeIds)]
      expect(badgeIds.length).toBe(uniqueBadgeIds.length)
    })
  })

  describe('Notifications', () => {
    it('should create and retrieve notifications correctly', async () => {
      const notification = await createNotification({
        userId: testUser.id,
        type: 'badge_earned',
        title: 'Test Badge Earned',
        message: 'You earned a test badge!',
        metadata: { badgeId: 'test-badge' }
      })

      expect(notification.success).toBe(true)

      const unreadCount = await getUnreadNotificationCount(testUser.id)
      expect(unreadCount).toBeGreaterThan(0)
    })

    it('should mark notifications as read', async () => {
      // Create a notification
      const notification = await createNotification({
        userId: testUser.id,
        type: 'achievement',
        title: 'Test Achievement',
        message: 'Test message',
        metadata: {}
      })

      if (notification.success && notification.data) {
        await markNotificationAsRead(notification.data.id)
        
        const unreadCount = await getUnreadNotificationCount(testUser.id)
        expect(unreadCount).toBe(0)
      }
    })
  })

  describe('Task Submissions', () => {
    it('should handle task submission workflow', async () => {
      // Submit a task
      const submission = await submitTask({
        userId: testUser.id,
        taskId: testTask.id,
        description: 'I completed this environmental task by doing...',
        photos: ['photo1.jpg'],
        location: { lat: 28.5355, lng: 77.3910 }
      })

      expect(submission.success).toBe(true)

      // Check pending submissions
      const pending = await getPendingSubmissions()
      expect(pending.some(p => p.id === submission.data?.id)).toBe(true)

      // Review the submission
      if (submission.data) {
        const review = await reviewSubmission(
          submission.data.id,
          'system', 
          'approved',
          'Great work on the environmental task!'
        )
        expect(review.success).toBe(true)
      }
    })

    it('should handle task rejection', async () => {
      const submission = await submitTask({
        userId: testUser.id,
        taskId: testTask.id,
        description: 'Short description',
        photos: [],
        location: null
      })

      if (submission.data) {
        const review = await reviewSubmission(
          submission.data.id,
          'system',
          'rejected',
          'Please provide more details and photos.'
        )
        expect(review.success).toBe(true)
        expect(review.pointsAwarded).toBe(0)
      }
    })
  })

  describe('Leaderboards', () => {
    it('should generate leaderboard correctly', async () => {
      // Add some points to user
      await addPointsWithStreakBonus(testUser.id, 100)

      const leaderboard = await generateLeaderboard('weekly', 'global', 10)
      expect(Array.isArray(leaderboard)).toBe(true)
      
      if (leaderboard.length > 0) {
        expect(leaderboard[0]).toHaveProperty('userId')
        expect(leaderboard[0]).toHaveProperty('points')
        expect(leaderboard[0]).toHaveProperty('rank')
      }
    })

    it('should get user rank correctly', async () => {
      await addPointsWithStreakBonus(testUser.id, 100)
      
      const rank = await getUserRank(testUser.id, 'weekly', 'global')
      expect(typeof rank).toBe('number')
      expect(rank).toBeGreaterThan(0)
    })

    it('should get nearby users in leaderboard', async () => {
      await addPointsWithStreakBonus(testUser.id, 100)
      
      const nearby = await getUsersNearby(testUser.id, 'weekly', 'global', 5)
      expect(Array.isArray(nearby)).toBe(true)
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete user journey', async () => {
      // 1. User starts with 0 points and no streak
      let userBadgesList = await getUserBadges(testUser.id)
      expect(userBadgesList.length).toBe(0)

      // 2. User submits and completes their first task
      const submission = await submitTask({
        userId: testUser.id,
        taskId: testTask.id,
        description: 'I completed my first environmental task by organizing a cleanup in my neighborhood. We collected 15 kg of plastic waste and planted 3 saplings.',
        photos: ['before.jpg', 'during.jpg', 'after.jpg'],
        location: { lat: 28.5355, lng: 77.3910 }
      })

      expect(submission.success).toBe(true)

      // 3. Task gets approved and points awarded
      if (submission.data) {
        const review = await reviewSubmission(
          submission.data.id,
          'system',
          'approved',
          'Excellent environmental work!'
        )
        expect(review.success).toBe(true)
        expect(review.pointsAwarded).toBeGreaterThan(0)
      }

      // 4. Check if badges were awarded
      const newBadges = await checkAndAwardBadges(testUser.id)
      userBadgesList = await getUserBadges(testUser.id)
      expect(userBadgesList.length).toBeGreaterThan(0)

      // 5. Check notifications were created
      const unreadCount = await getUnreadNotificationCount(testUser.id)
      expect(unreadCount).toBeGreaterThan(0)

      // 6. Check leaderboard position
      const rank = await getUserRank(testUser.id, 'all_time', 'global')
      expect(rank).toBeGreaterThan(0)
    })

    it('should handle multiple daily activities and streak bonus', async () => {
      // Day 1: First activity
      await addPointsWithStreakBonus(testUser.id, 50)
      let streak = await updateUserStreak(testUser.id)
      expect(streak.currentStreak).toBe(1)

      // Day 2: Continue streak (simulated)
      // In real scenario, this would be next day
      await addPointsWithStreakBonus(testUser.id, 50)
      
      // Check badges after multiple activities
      const badges = await checkAndAwardBadges(testUser.id)
      const userBadgesList = await getUserBadges(testUser.id)
      
      // User should have earned some badges by now
      expect(userBadgesList.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid user ID gracefully', async () => {
      const result = await addPointsWithStreakBonus('invalid-user', 50)
      expect(result.success).toBe(false)
    })

    it('should handle invalid task submission', async () => {
      const submission = await submitTask({
        userId: testUser.id,
        taskId: 'invalid-task',
        description: 'Test',
        photos: [],
        location: null
      })
      expect(submission.success).toBe(false)
    })

    it('should handle duplicate badge awards gracefully', async () => {
      // This should not throw an error even if badge criteria are met multiple times
      await addPointsWithStreakBonus(testUser.id, 100)
      
      await checkAndAwardBadges(testUser.id)
      await checkAndAwardBadges(testUser.id) // Second call should not create duplicates
      
      const userBadgesList = await getUserBadges(testUser.id)
      const badgeIds = userBadgesList.map(b => b.badgeId)
      const uniqueBadgeIds = [...new Set(badgeIds)]
      
      expect(badgeIds.length).toBe(uniqueBadgeIds.length)
    })
  })
})
