'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { lessons } from '../schema'
import { eq, like, desc, asc } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { InsertLesson, SelectLesson } from '../schema'

// Get all lessons with optional filtering
export async function getLessons({
  type,
  difficulty,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  limit = 50,
  offset = 0,
}: {
  type?: string
  difficulty?: string
  search?: string
  sortBy?: keyof SelectLesson
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
} = {}) {
  // Define the query with proper type
  let query = db.select().from(lessons).$dynamic()

  // Apply filters
  if (type) {
    query = query.where(eq(lessons.type, type))
  }

  if (difficulty) {
    query = query.where(eq(lessons.difficulty, difficulty))
  }

  if (search) {
    query = query.where(like(lessons.title, `%${search}%`))
  }

  // Apply sorting
  if (sortOrder === 'desc') {
    query = query.orderBy(desc(lessons[sortBy as keyof typeof lessons] as any))
  } else {
    query = query.orderBy(asc(lessons[sortBy as keyof typeof lessons] as any))
  }

  // Apply pagination
  query = query.limit(limit).offset(offset)
  
  // Execute the query and return the results
  return await query
}

// Get a single lesson by ID
export async function getLessonById(id: string) {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id))
  return lesson
}

// Create a new lesson (admin only)
export async function createLesson(data: Omit<InsertLesson, 'id' | 'createdAt' | 'updatedAt'>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here
  
  const id = randomUUID()
  const [lesson] = await db
    .insert(lessons)
    .values({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return lesson
}

// Update an existing lesson (admin only)
export async function updateLesson(id: string, data: Partial<Omit<InsertLesson, 'id' | 'createdAt' | 'updatedAt'>>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here

  const [lesson] = await db
    .update(lessons)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(lessons.id, id))
    .returning()

  return lesson
}

// Delete a lesson (admin only)
export async function deleteLesson(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here

  await db.delete(lessons).where(eq(lessons.id, id))
  return { success: true }
}