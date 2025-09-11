import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types'

export interface AuthenticatedUser {
  userId: string
  role: UserRole
  email?: string
}

/**
 * Authenticate user and get role information for API routes
 */
export async function authenticateAPI(): Promise<AuthenticatedUser | null> {
  try {
    const { userId, sessionClaims } = await auth()
    
    if (!userId) {
      return null
    }

    const role = (sessionClaims?.metadata as any)?.role as UserRole || 'student'
    const email = sessionClaims?.email as string

    return {
      userId,
      role,
      email
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Check if user has required role access
 */
export function hasRoleAccess(userRole: UserRole, requiredRoles: UserRole | UserRole[]): boolean {
  const roleHierarchy = {
    'student': 1,
    'teacher': 2,
    'ngo': 3,
    'admin': 4
  }

  const requiredRoleArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  // Admin always has access
  if (userRole === 'admin') return true
  
  // Check if user role is in required roles or has higher hierarchy
  return requiredRoleArray.some(requiredRole => {
    return userRole === requiredRole || roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  })
}

/**
 * Middleware function for protecting API routes
 */
export async function withRoleAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  requiredRoles: UserRole | UserRole[]
) {
  return async (req: NextRequest) => {
    try {
      const user = await authenticateAPI()

      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      }

      if (!hasRoleAccess(user.role, requiredRoles)) {
        return NextResponse.json(
          { 
            error: 'Insufficient permissions', 
            code: 'FORBIDDEN',
            required: requiredRoles,
            current: user.role
          },
          { status: 403 }
        )
      }

      return await handler(req, user)
    } catch (error) {
      console.error('API Auth Error:', error)
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      )
    }
  }
}

/**
 * Create a protected API route handler
 */
export function createProtectedRoute(requiredRoles: UserRole | UserRole[]) {
  return {
    GET: (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) =>
      withRoleAuth(handler, requiredRoles),
    POST: (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) =>
      withRoleAuth(handler, requiredRoles),
    PUT: (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) =>
      withRoleAuth(handler, requiredRoles),
    DELETE: (handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) =>
      withRoleAuth(handler, requiredRoles),
  }
}

/**
 * Get resource ownership permissions
 */
export function checkResourceOwnership(
  userId: string, 
  resourceOwnerId: string, 
  userRole: UserRole
): boolean {
  // Admin can access all resources
  if (userRole === 'admin') return true
  
  // Teachers can access student resources
  if (userRole === 'teacher' && resourceOwnerId !== userId) {
    // Here you could add additional logic to check if teacher has access to specific student
    return true
  }
  
  // NGOs can access resources in their domain
  if (userRole === 'ngo') {
    // Here you could add logic to check if NGO has access to specific resources
    return true
  }
  
  // Users can only access their own resources
  return userId === resourceOwnerId
}

/**
 * Error responses for common authorization scenarios
 */
export const AuthErrors = {
  UNAUTHORIZED: () => NextResponse.json(
    { error: 'Authentication required', code: 'UNAUTHORIZED' },
    { status: 401 }
  ),
  FORBIDDEN: (required: UserRole | UserRole[], current: UserRole) => NextResponse.json(
    { 
      error: 'Insufficient permissions', 
      code: 'FORBIDDEN',
      required,
      current
    },
    { status: 403 }
  ),
  INVALID_OWNERSHIP: () => NextResponse.json(
    { error: 'You can only access your own resources', code: 'INVALID_OWNERSHIP' },
    { status: 403 }
  ),
  INTERNAL_ERROR: (message?: string) => NextResponse.json(
    { error: message || 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}
