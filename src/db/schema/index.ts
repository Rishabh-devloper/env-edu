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

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertLesson = typeof lessons.$inferInsert
export type SelectLesson = typeof lessons.$inferSelect
export type InsertUserProgress = typeof userProgress.$inferInsert
export type SelectUserProgress = typeof userProgress.$inferSelect
export type InsertCompleted = typeof userCompletedLessons.$inferInsert
export type SelectCompleted = typeof userCompletedLessons.$inferSelect
export type InsertPointsLog = typeof pointsLog.$inferInsert
export type SelectPointsLog = typeof pointsLog.$inferSelect


