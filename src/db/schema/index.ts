import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core'

// Users table (Clerk user linkage by id)
export const users = pgTable('users', {
  id: varchar('id', { length: 191 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 120 }),
  lastName: varchar('last_name', { length: 120 }),
  role: varchar('role', { length: 32 }).default('student').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Lessons catalog (content metadata)
export const lessons = pgTable('lessons', {
  id: varchar('id', { length: 191 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 32 }).notNull(),
  mediaUrl: text('media_url'),
  durationMin: integer('duration_min').notNull(),
  difficulty: varchar('difficulty', { length: 32 }).notNull(),
  ecoPoints: integer('eco_points').notNull(),
  tags: jsonb('tags').$type<string[]>().default([] as any).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// User progress snapshot
export const userProgress = pgTable('user_progress', {
  userId: varchar('user_id', { length: 191 }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  totalPoints: integer('total_points').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  badges: jsonb('badges').$type<string[]>().default([] as any).notNull(),
  completedLessonsCount: integer('completed_lessons_count').default(0).notNull(),
  streak: integer('streak').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Completed lessons mapping
export const userCompletedLessons = pgTable('user_completed_lessons', {
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar('lesson_id', { length: 191 }).notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.lessonId] })
}))

// Quizzes table
export const quizzes = pgTable('quizzes', {
  id: varchar('id', { length: 191 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  lessonId: varchar('lesson_id', { length: 191 }).references(() => lessons.id, { onDelete: 'cascade' }),
  questions: jsonb('questions').$type<QuizQuestion[]>().notNull(),
  timeLimit: integer('time_limit'), // in minutes
  passingScore: integer('passing_score').default(70).notNull(), // percentage
  ecoPoints: integer('eco_points').default(10).notNull(),
  difficulty: varchar('difficulty', { length: 32 }).default('medium').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Quiz attempts table
export const quizAttempts = pgTable('quiz_attempts', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: varchar('quiz_id', { length: 191 }).notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(), // percentage
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  timeSpent: integer('time_spent').notNull(), // in seconds
  answers: jsonb('answers').$type<QuizAnswer[]>().notNull(),
  passed: boolean('passed').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
})

// Audit log for eco points changes
export const pointsLog = pgTable('points_log', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  delta: integer('delta').notNull(),
  reason: text('reason'),
  activityType: varchar('activity_type', { length: 64 }),
  activityId: varchar('activity_id', { length: 191 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Type definitions for quiz data
export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false'
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}

export interface QuizAnswer {
  questionId: string
  answer: string | number
  isCorrect: boolean
  timeSpent: number
}

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertLesson = typeof lessons.$inferInsert
export type SelectLesson = typeof lessons.$inferSelect
export type InsertUserProgress = typeof userProgress.$inferInsert
export type SelectUserProgress = typeof userProgress.$inferSelect
export type InsertCompleted = typeof userCompletedLessons.$inferInsert
export type SelectCompleted = typeof userCompletedLessons.$inferSelect
export type InsertQuiz = typeof quizzes.$inferInsert
export type SelectQuiz = typeof quizzes.$inferSelect
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert
export type SelectQuizAttempt = typeof quizAttempts.$inferSelect
export type InsertPointsLog = typeof pointsLog.$inferInsert
export type SelectPointsLog = typeof pointsLog.$inferSelect

// Enhanced Gamification Tables

// Badges catalog
export const badges = pgTable('badges', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(), // eco_action, knowledge, leadership, community
  rarity: varchar('rarity', { length: 32 }).default('common').notNull(), // common, rare, epic, legendary
  pointsRequired: integer('points_required').default(0).notNull(),
  criteria: jsonb('criteria').$type<BadgeCriteria>().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// User earned badges
export const userBadges = pgTable('user_badges', {
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: varchar('badge_id', { length: 191 }).notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow().notNull(),
  progress: integer('progress').default(0).notNull(), // for progressive badges
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.badgeId] })
}))

// Tasks/Challenges system
export const tasks = pgTable('tasks', {
  id: varchar('id', { length: 191 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 64 }).notNull(), // tree_planting, waste_management, energy_conservation, water_conservation
  difficulty: varchar('difficulty', { length: 32 }).default('medium').notNull(),
  ecoPoints: integer('eco_points').notNull(),
  estimatedTime: integer('estimated_time').notNull(), // in minutes
  requirements: jsonb('requirements').$type<TaskRequirements>(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: varchar('created_by', { length: 191 }).references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// User task submissions
export const taskSubmissions = pgTable('task_submissions', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: varchar('task_id', { length: 191 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 32 }).default('pending').notNull(), // pending, approved, rejected
  submission: jsonb('submission').$type<TaskSubmissionData>().notNull(),
  reviewedBy: varchar('reviewed_by', { length: 191 }).references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
})

// User daily activity streaks
export const userStreaks = pgTable('user_streaks', {
  userId: varchar('user_id', { length: 191 }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActiveDate: timestamp('last_active_date', { withTimezone: true }).defaultNow().notNull(),
  streakMultiplier: integer('streak_multiplier').default(1).notNull(), // bonus multiplier for points
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Leaderboard entries (cached for performance)
export const leaderboards = pgTable('leaderboards', {
  id: varchar('id', { length: 191 }).primaryKey(),
  type: varchar('type', { length: 32 }).notNull(), // daily, weekly, monthly, all_time
  scope: varchar('scope', { length: 32 }).notNull(), // global, school, class
  scopeId: varchar('scope_id', { length: 191 }), // for school/class scoped boards
  data: jsonb('data').$type<LeaderboardData>().notNull(),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
})

// User notifications
export const notifications = pgTable('notifications', {
  id: varchar('id', { length: 191 }).primaryKey(),
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 32 }).notNull(), // achievement, level_up, task_approved, streak, reminder
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data').$type<NotificationData>(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// System analytics (for admin dashboard)
export const analyticsEvents = pgTable('analytics_events', {
  id: varchar('id', { length: 191 }).primaryKey(),
  eventType: varchar('event_type', { length: 64 }).notNull(),
  userId: varchar('user_id', { length: 191 }).references(() => users.id, { onDelete: 'cascade' }),
  data: jsonb('data').$type<AnalyticsData>(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
})

// School/Organization management
export const schools = pgTable('schools', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  type: varchar('type', { length: 64 }).default('school').notNull(), // school, college, organization
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// User school affiliations
export const userSchools = pgTable('user_schools', {
  userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  schoolId: varchar('school_id', { length: 191 }).notNull().references(() => schools.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 32 }).default('student').notNull(), // student, teacher, admin
  className: varchar('class_name', { length: 100 }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.schoolId] })
}))

// Enhanced Type Definitions
export interface BadgeCriteria {
  type: 'points' | 'lessons' | 'tasks' | 'streak' | 'quiz_score' | 'environmental_impact'
  target: number
  conditions?: {
    category?: string
    difficulty?: string
    timeframe?: 'daily' | 'weekly' | 'monthly'
    [key: string]: any
  }
}

export interface TaskRequirements {
  photoRequired: boolean
  locationRequired: boolean
  descriptionMinLength?: number
  verificationType: 'auto' | 'peer' | 'teacher'
  materials?: string[]
}

export interface TaskSubmissionData {
  description: string
  photos?: string[]
  location?: {
    lat: number
    lng: number
    address: string
  }
  metadata?: {
    [key: string]: any
  }
}

export interface LeaderboardData {
  entries: Array<{
    userId: string
    userName: string
    points: number
    level: number
    rank: number
    avatar?: string
    school?: string
    badges: number
  }>
  totalParticipants: number
  lastCalculated: string
}

export interface NotificationData {
  actionUrl?: string
  badgeId?: string
  taskId?: string
  points?: number
  level?: number
  [key: string]: any
}

export interface AnalyticsData {
  [key: string]: any
}

// Additional type exports for new tables
export type InsertBadge = typeof badges.$inferInsert
export type SelectBadge = typeof badges.$inferSelect
export type InsertUserBadge = typeof userBadges.$inferInsert
export type SelectUserBadge = typeof userBadges.$inferSelect
export type InsertTask = typeof tasks.$inferInsert
export type SelectTask = typeof tasks.$inferSelect
export type InsertTaskSubmission = typeof taskSubmissions.$inferInsert
export type SelectTaskSubmission = typeof taskSubmissions.$inferSelect
export type InsertUserStreak = typeof userStreaks.$inferInsert
export type SelectUserStreak = typeof userStreaks.$inferSelect
export type InsertLeaderboard = typeof leaderboards.$inferInsert
export type SelectLeaderboard = typeof leaderboards.$inferSelect
export type InsertNotification = typeof notifications.$inferInsert
export type SelectNotification = typeof notifications.$inferSelect
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert
export type SelectAnalyticsEvent = typeof analyticsEvents.$inferSelect
export type InsertSchool = typeof schools.$inferInsert
export type SelectSchool = typeof schools.$inferSelect
export type InsertUserSchool = typeof userSchools.$inferInsert
export type SelectUserSchool = typeof userSchools.$inferSelect
