'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../index'
import { users, userProgress } from '../schema'
import { eq } from 'drizzle-orm'
import { InsertUser, SelectUser } from '../schema'

// Get current user profile
export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  return user
}

// Get user by ID (admin only)
export async function getUserById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here

  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user
}

// Update current user profile
export async function updateCurrentUser(data: Partial<Omit<InsertUser, 'id' | 'email' | 'createdAt'>>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning()

  return user
}

// Update user role (admin only)
export async function updateUserRole(id: string, role: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here

  const [user] = await db
    .update(users)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  return user
}

// Get all users (admin only)
export async function getUsers({
  role,
  limit = 50,
  offset = 0,
}: {
  role?: string
  limit?: number
  offset?: number
} = {}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // TODO: Add admin role check here

  let query = db.select().from(users).$dynamic()

  if (role) {
    query = query.where(eq(users.role, role))
  }

  query = query.limit(limit).offset(offset)

  // Execute the query and return the results
  return await query
}