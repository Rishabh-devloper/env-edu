'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { 
  tasks, 
  taskSubmissions, 
  users,
  userProgress
} from '../schema'
import { eq, and, desc, sql, inArray } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { 
  InsertTask, 
  SelectTask, 
  InsertTaskSubmission,
  SelectTaskSubmission,
  TaskSubmissionData 
} from '../schema'
import { trackActivity } from './gamification'

// ==================== TASKS MANAGEMENT ====================

export async function getAllTasks(category?: string, difficulty?: string) {
  let query = db.select().from(tasks).where(eq(tasks.isActive, true)).$dynamic()
  
  if (category) {
    query = query.where(eq(tasks.category, category))
  }
  
  if (difficulty) {
    query = query.where(eq(tasks.difficulty, difficulty))
  }
  
  return await query.orderBy(desc(tasks.createdAt))
}

export async function getTaskById(taskId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.isActive, true)))
  
  return task
}

export async function createTask(taskData: Omit<InsertTask, 'id' | 'createdAt' | 'updatedAt'>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const taskId = randomUUID()
  
  const [task] = await db
    .insert(tasks)
    .values({
      id: taskId,
      ...taskData,
      createdBy: userId,
    })
    .returning()
  
  return task
}

export async function updateTask(taskId: string, updates: Partial<InsertTask>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Only allow creator or admin to update
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId))
  if (!task || (task.createdBy !== userId)) {
    throw new Error('Unauthorized to update this task')
  }

  const [updatedTask] = await db
    .update(tasks)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning()
  
  return updatedTask
}

// ==================== TASK SUBMISSIONS ====================

export async function submitTask(
  taskId: string, 
  submissionData: TaskSubmissionData
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Check if task exists
  const task = await getTaskById(taskId)
  if (!task) throw new Error('Task not found')

  // Check if user already submitted this task
  const [existingSubmission] = await db
    .select()
    .from(taskSubmissions)
    .where(and(
      eq(taskSubmissions.userId, userId),
      eq(taskSubmissions.taskId, taskId)
    ))

  if (existingSubmission) {
    throw new Error('You have already submitted this task')
  }

  const submissionId = randomUUID()
  
  const [submission] = await db
    .insert(taskSubmissions)
    .values({
      id: submissionId,
      userId,
      taskId,
      submission: submissionData,
      status: 'pending',
    })
    .returning()

  return submission
}

export async function getUserSubmissions() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await db
    .select({
      submission: taskSubmissions,
      task: tasks,
    })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .where(eq(taskSubmissions.userId, userId))
    .orderBy(desc(taskSubmissions.submittedAt))
}

export async function getPendingSubmissions() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add role-based authorization (teachers/admins only)

  return await db
    .select({
      submission: taskSubmissions,
      task: tasks,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      }
    })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .innerJoin(users, eq(taskSubmissions.userId, users.id))
    .where(eq(taskSubmissions.status, 'pending'))
    .orderBy(desc(taskSubmissions.submittedAt))
}

export async function reviewTaskSubmission(
  submissionId: string,
  status: 'approved' | 'rejected',
  feedback?: string
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add role-based authorization (teachers/admins only)

  const [submission] = await db
    .update(taskSubmissions)
    .set({
      status,
      feedback,
      reviewedBy: userId,
      reviewedAt: new Date(),
    })
    .where(eq(taskSubmissions.id, submissionId))
    .returning()

  if (!submission) throw new Error('Submission not found')

  // If approved, award points and track activity
  if (status === 'approved') {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, submission.taskId))
    
    if (task) {
      await trackActivity(
        submission.userId,
        'task_completion',
        task.ecoPoints,
        { 
          id: task.id, 
          taskTitle: task.title,
          category: task.category 
        }
      )
    }
  }

  return submission
}

// ==================== TASK ANALYTICS ====================

export async function getTaskStats() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Total tasks available
  const [totalTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(eq(tasks.isActive, true))

  // User's completed tasks
  const [completedTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(taskSubmissions)
    .where(and(
      eq(taskSubmissions.userId, userId),
      eq(taskSubmissions.status, 'approved')
    ))

  // User's pending tasks
  const [pendingTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(taskSubmissions)
    .where(and(
      eq(taskSubmissions.userId, userId),
      eq(taskSubmissions.status, 'pending')
    ))

  // Points earned from tasks
  const [pointsFromTasks] = await db
    .select({ total: sql<number>`sum(${tasks.ecoPoints})` })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .where(and(
      eq(taskSubmissions.userId, userId),
      eq(taskSubmissions.status, 'approved')
    ))

  return {
    totalAvailable: totalTasks.count || 0,
    completed: completedTasks.count || 0,
    pending: pendingTasks.count || 0,
    pointsEarned: pointsFromTasks.total || 0,
    completionRate: totalTasks.count ? 
      Math.round((completedTasks.count / totalTasks.count) * 100) : 0
  }
}

export async function getTasksByCategory() {
  const tasks = await getAllTasks()
  
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {} as Record<string, SelectTask[]>)
  
  return tasksByCategory
}

export async function getUserTaskProgress(userId: string) {
  const submissions = await db
    .select({
      taskId: taskSubmissions.taskId,
      status: taskSubmissions.status,
      submittedAt: taskSubmissions.submittedAt,
      ecoPoints: tasks.ecoPoints,
      category: tasks.category,
    })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .where(eq(taskSubmissions.userId, userId))

  const completed = submissions.filter(s => s.status === 'approved')
  const pending = submissions.filter(s => s.status === 'pending')
  
  const pointsByCategory = completed.reduce((acc, submission) => {
    acc[submission.category] = (acc[submission.category] || 0) + submission.ecoPoints
    return acc
  }, {} as Record<string, number>)

  return {
    totalSubmissions: submissions.length,
    completed: completed.length,
    pending: pending.length,
    pointsByCategory,
    recentActivity: submissions
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5)
  }
}
