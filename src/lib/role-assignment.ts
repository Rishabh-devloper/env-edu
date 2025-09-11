import { clerkClient } from '@clerk/nextjs/server'
import { UserRole } from '@/types'

/**
 * Assign role to user in Clerk
 * This function should be used by admins to assign roles to users
 */
export async function assignUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log('Attempting to assign role:', role, 'to user:', userId)
    
    // Check if Clerk is properly configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.error('CLERK_SECRET_KEY is not configured!')
      return false
    }

    console.log('Clerk secret key found, updating metadata...')
    
    const result = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    })
    
    console.log('Role assignment successful:', result.id)
    return true
  } catch (error) {
    console.error('Error assigning role:', error)
    
    // Check if it's a Clerk client issue
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if (error.message.includes('Unauthorized')) {
        console.error('Clerk authentication failed - check your CLERK_SECRET_KEY')
      }
    }
    
    return false
  }
}

/**
 * Get user role from Clerk
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      console.warn('Clerk secret key not configured. Returning default role.')
      return 'student'
    }

    const user = await clerkClient.users.getUser(userId)
    return (user.publicMetadata?.role as UserRole) || 'student'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'student'
  }
}

/**
 * Batch assign roles to multiple users
 */
export async function batchAssignRoles(assignments: { userId: string; role: UserRole }[]): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const assignment of assignments) {
    const result = await assignUserRole(assignment.userId, assignment.role)
    if (result) {
      success++
    } else {
      failed++
    }
  }

  return { success, failed }
}

/**
 * Get all users with their roles for admin management
 */
export async function getAllUsersWithRoles(limit: number = 50, offset: number = 0) {
  try {
    const users = await clerkClient.users.getUserList({
      limit,
      offset
    })

    return users.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: (user.publicMetadata?.role as UserRole) || 'student',
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    }))
  } catch (error) {
    console.error('Error getting users with roles:', error)
    return []
  }
}

/**
 * Default role assignment logic
 * This can be customized based on your business rules
 */
export function getDefaultRole(email: string): UserRole {
  // Example logic - customize based on your needs
  if (email.includes('admin')) return 'admin'
  if (email.includes('teacher') || email.includes('edu')) return 'teacher'
  if (email.includes('ngo') || email.includes('org')) return 'ngo'
  return 'student'
}

/**
 * Role validation
 */
export function isValidRole(role: string): role is UserRole {
  return ['student', 'teacher', 'ngo', 'admin'].includes(role)
}

/**
 * Role hierarchy for permission checking
 */
export const roleHierarchy = {
  student: 1,
  teacher: 2,
  ngo: 3,
  admin: 4
} as const

/**
 * Check if a role has higher or equal permission level
 */
export function hasHigherPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
