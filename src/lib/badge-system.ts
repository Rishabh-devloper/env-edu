import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from './db'

// Badge System Types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'eco_action' | 'knowledge' | 'leadership' | 'community' | 'achievement'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  pointsRequired: number
  criteriaType: 'points' | 'lessons' | 'tasks' | 'streak' | 'quiz_score' | 'environmental_impact' | 'social_engagement'
  criteriaTarget: number
  criteriaConditions?: Record<string, any>
  rewardPoints: number
  unlockRequirements?: Record<string, any>
  isActive: boolean
}

export interface UserBadge {
  id: number
  userId: string
  badgeId: string
  earnedAt: string
  progress: number
  metadata?: Record<string, any>
}

export interface UserProgress {
  userId: string
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  lessonsCompleted: number
  quizzesCompleted: number
  tasksCompleted: number
  averageQuizScore: number
  treesPlanted: number
  wasteRecycledKg: number
  badgesEarned: number
}

/**
 * Dynamic Badge Earning System
 */
export class BadgeSystem {
  
  /**
   * Check and award badges for a user based on their current progress
   */
  static async checkAndAwardBadges(userId: string, activityType?: string): Promise<UserBadge[]> {
    try {
      // Get user's current progress
      const userProgress = await this.getUserProgress(userId)
      if (!userProgress) return []

      // Get all available badges
      const availableBadges = await this.getAllBadges()
      
      // Get badges user already has
      const userBadges = await this.getUserBadges(userId)
      const earnedBadgeIds = new Set(userBadges.map(b => b.badgeId))

      // Check which badges user can earn
      const newBadges: UserBadge[] = []
      
      for (const badge of availableBadges) {
        if (earnedBadgeIds.has(badge.id) || !badge.isActive) continue

        // Check if user meets badge criteria
        if (await this.checkBadgeCriteria(badge, userProgress)) {
          const newBadge = await this.awardBadge(userId, badge.id, activityType)
          if (newBadge) {
            newBadges.push(newBadge)
            
            // Award bonus points for earning badge
            if (badge.rewardPoints > 0) {
              await this.addPoints(userId, badge.rewardPoints, `Badge earned: ${badge.name}`, 'badge_reward')
            }
          }
        }
      }

      return newBadges
    } catch (error) {
      console.error('Error checking and awarding badges:', error)
      return []
    }
  }

  /**
   * Check if user meets criteria for a specific badge
   */
  private static async checkBadgeCriteria(badge: Badge, userProgress: UserProgress): Promise<boolean> {
    switch (badge.criteriaType) {
      case 'points':
        return userProgress.totalPoints >= badge.criteriaTarget

      case 'lessons':
        return userProgress.lessonsCompleted >= badge.criteriaTarget

      case 'tasks':
        return userProgress.tasksCompleted >= badge.criteriaTarget

      case 'streak':
        return userProgress.currentStreak >= badge.criteriaTarget || userProgress.longestStreak >= badge.criteriaTarget

      case 'quiz_score':
        // Check if user has scored the target percentage on any quiz
        if (badge.criteriaTarget === 100) {
          // Perfect score badge - check recent quiz results
          const perfectScores = await db.query(
            'SELECT COUNT(*) as count FROM quiz_results WHERE user_id = $1 AND score = 100',
            [userProgress.userId]
          )
          return perfectScores.rows[0]?.count > 0
        }
        return userProgress.averageQuizScore >= badge.criteriaTarget

      case 'environmental_impact':
        // Check various environmental metrics
        return userProgress.treesPlanted >= badge.criteriaTarget || 
               userProgress.wasteRecycledKg >= badge.criteriaTarget

      case 'social_engagement':
        // Check social activities (posts, comments, etc.)
        const socialActivity = await db.query(
          'SELECT SUM(posts_created + comments_made) as total FROM user_progress_enhanced WHERE user_id = $1',
          [userProgress.userId]
        )
        return socialActivity.rows[0]?.total >= badge.criteriaTarget

      default:
        return false
    }
  }

  /**
   * Award a badge to a user
   */
  private static async awardBadge(userId: string, badgeId: string, activityType?: string): Promise<UserBadge | null> {
    try {
      const result = await db.query(`
        INSERT INTO user_badges (user_id, badge_id, progress, metadata)
        VALUES ($1, $2, 100, $3)
        ON CONFLICT (user_id, badge_id) DO NOTHING
        RETURNING *
      `, [
        userId, 
        badgeId, 
        JSON.stringify({ 
          earnedVia: activityType || 'automatic',
          timestamp: new Date().toISOString()
        })
      ])

      if (result.rows.length > 0) {
        const newBadge = result.rows[0]

        // Update user's badge count
        await db.query(`
          UPDATE user_progress_enhanced 
          SET badges_earned = badges_earned + 1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1
        `, [userId])

        // Add to activity feed
        const badge = await this.getBadgeById(badgeId)
        if (badge) {
          await this.addToActivityFeed(
            userId,
            'badge_earned',
            `Earned ${badge.name} badge!`,
            `You've unlocked the ${badge.name} badge: ${badge.description}`,
            badge.rewardPoints
          )
        }

        return newBadge
      }

      return null
    } catch (error) {
      console.error('Error awarding badge:', error)
      return null
    }
  }

  /**
   * Get user's current progress from database
   */
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const result = await db.query(`
        SELECT * FROM user_progress_enhanced WHERE user_id = $1
      `, [userId])

      if (result.rows.length === 0) {
        // Create initial progress record
        await this.initializeUserProgress(userId)
        return await this.getUserProgress(userId)
      }

      return result.rows[0]
    } catch (error) {
      console.error('Error getting user progress:', error)
      return null
    }
  }

  /**
   * Initialize user progress record
   */
  private static async initializeUserProgress(userId: string): Promise<void> {
    try {
      await db.query(`
        INSERT INTO user_progress_enhanced (user_id, last_activity_date)
        VALUES ($1, CURRENT_DATE)
        ON CONFLICT (user_id) DO NOTHING
      `, [userId])
    } catch (error) {
      console.error('Error initializing user progress:', error)
    }
  }

  /**
   * Get all available badges
   */
  static async getAllBadges(): Promise<Badge[]> {
    try {
      const result = await db.query(`
        SELECT * FROM badges WHERE is_active = true ORDER BY points_required ASC
      `)
      return result.rows
    } catch (error) {
      console.error('Error getting badges:', error)
      return []
    }
  }

  /**
   * Get user's earned badges
   */
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const result = await db.query(`
        SELECT ub.*, b.name, b.description, b.icon, b.category, b.rarity
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = $1
        ORDER BY ub.earned_at DESC
      `, [userId])
      return result.rows
    } catch (error) {
      console.error('Error getting user badges:', error)
      return []
    }
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(badgeId: string): Promise<Badge | null> {
    try {
      const result = await db.query(`
        SELECT * FROM badges WHERE id = $1
      `, [badgeId])
      return result.rows[0] || null
    } catch (error) {
      console.error('Error getting badge by ID:', error)
      return null
    }
  }

  /**
   * Update user progress after completing an activity
   */
  static async updateUserProgress(
    userId: string, 
    activityType: 'lesson' | 'quiz' | 'task' | 'social',
    data: {
      points?: number
      lessonId?: string
      quizScore?: number
      taskCategory?: string
      environmentalImpact?: {
        treesPlanted?: number
        wasteRecycled?: number
        energySaved?: number
        waterSaved?: number
      }
    }
  ): Promise<void> {
    try {
      // Update streak
      await this.updateStreak(userId)

      let updateQuery = `
        UPDATE user_progress_enhanced SET 
          updated_at = CURRENT_TIMESTAMP,
          last_activity_date = CURRENT_DATE
      `
      const updateParams: any[] = [userId]
      let paramIndex = 2

      // Update based on activity type
      switch (activityType) {
        case 'lesson':
          updateQuery += `, lessons_completed = lessons_completed + 1`
          if (data.points) {
            updateQuery += `, total_points = total_points + $${paramIndex}, points_from_lessons = points_from_lessons + $${paramIndex}`
            updateParams.push(data.points)
            paramIndex++
          }
          break

        case 'quiz':
          updateQuery += `, quizzes_completed = quizzes_completed + 1`
          if (data.quizScore !== undefined) {
            updateQuery += `, average_quiz_score = (average_quiz_score * (quizzes_completed - 1) + $${paramIndex}) / quizzes_completed`
            updateParams.push(data.quizScore)
            paramIndex++
          }
          if (data.points) {
            updateQuery += `, total_points = total_points + $${paramIndex}, points_from_quizzes = points_from_quizzes + $${paramIndex}`
            updateParams.push(data.points)
            paramIndex++
          }
          break

        case 'task':
          updateQuery += `, tasks_completed = tasks_completed + 1`
          if (data.points) {
            updateQuery += `, total_points = total_points + $${paramIndex}, points_from_tasks = points_from_tasks + $${paramIndex}`
            updateParams.push(data.points)
            paramIndex++
          }
          // Update environmental impact
          if (data.environmentalImpact) {
            if (data.environmentalImpact.treesPlanted) {
              updateQuery += `, trees_planted = trees_planted + $${paramIndex}`
              updateParams.push(data.environmentalImpact.treesPlanted)
              paramIndex++
            }
            if (data.environmentalImpact.wasteRecycled) {
              updateQuery += `, waste_recycled_kg = waste_recycled_kg + $${paramIndex}`
              updateParams.push(data.environmentalImpact.wasteRecycled)
              paramIndex++
            }
          }
          break

        case 'social':
          if (data.points) {
            updateQuery += `, total_points = total_points + $${paramIndex}, points_from_social = points_from_social + $${paramIndex}`
            updateParams.push(data.points)
            paramIndex++
          }
          break
      }

      // Update level based on points
      updateQuery += `, level = GREATEST(1, FLOOR(total_points / 100) + 1)`
      updateQuery += ` WHERE user_id = $1`

      await db.query(updateQuery, updateParams)

      // Check for new badges after updating progress
      setTimeout(() => {
        this.checkAndAwardBadges(userId, activityType)
      }, 1000) // Small delay to ensure database is updated

    } catch (error) {
      console.error('Error updating user progress:', error)
    }
  }

  /**
   * Update user's daily streak
   */
  private static async updateStreak(userId: string): Promise<void> {
    try {
      const result = await db.query(`
        SELECT last_activity_date, current_streak, longest_streak 
        FROM user_progress_enhanced 
        WHERE user_id = $1
      `, [userId])

      if (result.rows.length === 0) return

      const { last_activity_date, current_streak, longest_streak } = result.rows[0]
      const today = new Date().toISOString().split('T')[0]
      const lastActivity = last_activity_date?.toISOString().split('T')[0]

      let newStreak = current_streak || 0
      let newLongestStreak = longest_streak || 0

      if (lastActivity === today) {
        // Same day, no change to streak
        return
      } else if (lastActivity && this.isConsecutiveDay(lastActivity, today)) {
        // Consecutive day, increase streak
        newStreak += 1
        newLongestStreak = Math.max(newLongestStreak, newStreak)
      } else {
        // Gap in activity, reset streak
        newStreak = 1
      }

      await db.query(`
        UPDATE user_progress_enhanced 
        SET current_streak = $2, longest_streak = $3,
            streak_multiplier = LEAST(2.0, 1.0 + (current_streak * 0.1))
        WHERE user_id = $1
      `, [userId, newStreak, newLongestStreak])

    } catch (error) {
      console.error('Error updating streak:', error)
    }
  }

  /**
   * Check if two dates are consecutive days
   */
  private static isConsecutiveDay(lastDate: string, currentDate: string): boolean {
    const last = new Date(lastDate)
    const current = new Date(currentDate)
    const diffTime = current.getTime() - last.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays === 1
  }

  /**
   * Add points to user
   */
  static async addPoints(userId: string, points: number, reason: string, activityType: string): Promise<void> {
    try {
      await db.query(`
        UPDATE user_progress_enhanced 
        SET total_points = total_points + $2, 
            level = GREATEST(1, FLOOR((total_points + $2) / 100) + 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `, [userId, points])

      // Add to activity feed
      await this.addToActivityFeed(userId, 'points_earned', reason, `Earned ${points} points`, points)

    } catch (error) {
      console.error('Error adding points:', error)
    }
  }

  /**
   * Add entry to activity feed
   */
  private static async addToActivityFeed(
    userId: string,
    activityType: string,
    title: string,
    description: string,
    points: number = 0,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await db.query(`
        INSERT INTO activity_feed (user_id, activity_type, activity_title, activity_description, points_earned, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [userId, activityType, title, description, points, JSON.stringify(metadata)])
    } catch (error) {
      console.error('Error adding to activity feed:', error)
    }
  }

  /**
   * Get user's activity feed
   */
  static async getActivityFeed(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const result = await db.query(`
        SELECT * FROM activity_feed 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `, [userId, limit])
      return result.rows
    } catch (error) {
      console.error('Error getting activity feed:', error)
      return []
    }
  }

  /**
   * Get badge progress for a user
   */
  static async getBadgeProgress(userId: string, badgeId: string): Promise<number> {
    try {
      const badge = await this.getBadgeById(badgeId)
      const userProgress = await this.getUserProgress(userId)
      
      if (!badge || !userProgress) return 0

      // Check if already earned
      const userBadges = await this.getUserBadges(userId)
      if (userBadges.some(b => b.badgeId === badgeId)) return 100

      // Calculate progress based on criteria
      switch (badge.criteriaType) {
        case 'points':
          return Math.min((userProgress.totalPoints / badge.criteriaTarget) * 100, 100)
        case 'lessons':
          return Math.min((userProgress.lessonsCompleted / badge.criteriaTarget) * 100, 100)
        case 'tasks':
          return Math.min((userProgress.tasksCompleted / badge.criteriaTarget) * 100, 100)
        case 'streak':
          return Math.min((Math.max(userProgress.currentStreak, userProgress.longestStreak) / badge.criteriaTarget) * 100, 100)
        default:
          return 0
      }
    } catch (error) {
      console.error('Error getting badge progress:', error)
      return 0
    }
  }
}

export default BadgeSystem
