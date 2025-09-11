import { NextRequest, NextResponse } from 'next/server'
import { authenticateAPI, hasRoleAccess, AuthErrors } from '@/lib/api-auth'
import { 
  getAllUsersWithRoles, 
  assignUserRole, 
  batchAssignRoles, 
  isValidRole 
} from '@/lib/role-assignment'
import { UserRole } from '@/types'

/**
 * GET /api/admin/users
 * Get all users with their roles (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate and check admin role
    const user = await authenticateAPI()
    if (!user) {
      return AuthErrors.UNAUTHORIZED()
    }

    if (!hasRoleAccess(user.role, 'admin')) {
      return AuthErrors.FORBIDDEN('admin', user.role)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const role = searchParams.get('role') as UserRole | null

    // Get all users with roles
    const users = await getAllUsersWithRoles(limit, offset)

    // Filter by role if specified
    const filteredUsers = role ? users.filter(u => u.role === role) : users

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return AuthErrors.INTERNAL_ERROR('Failed to fetch users')
  }
}

/**
 * POST /api/admin/users
 * Batch update user roles (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate and check admin role
    const user = await authenticateAPI()
    if (!user) {
      return AuthErrors.UNAUTHORIZED()
    }

    if (!hasRoleAccess(user.role, 'admin')) {
      return AuthErrors.FORBIDDEN('admin', user.role)
    }

    const body = await request.json()
    const { assignments } = body

    // Validate request
    if (!Array.isArray(assignments)) {
      return NextResponse.json(
        { error: 'assignments must be an array', code: 'INVALID_REQUEST' },
        { status: 400 }
      )
    }

    // Validate each assignment
    for (const assignment of assignments) {
      if (!assignment.userId || !assignment.role) {
        return NextResponse.json(
          { error: 'Each assignment must have userId and role', code: 'INVALID_ASSIGNMENT' },
          { status: 400 }
        )
      }

      if (!isValidRole(assignment.role)) {
        return NextResponse.json(
          { error: `Invalid role: ${assignment.role}`, code: 'INVALID_ROLE' },
          { status: 400 }
        )
      }
    }

    // Process batch role assignments
    const result = await batchAssignRoles(assignments)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully assigned roles to ${result.success} users. ${result.failed} failed.`
    })
  } catch (error) {
    console.error('Error batch assigning roles:', error)
    return AuthErrors.INTERNAL_ERROR('Failed to assign roles')
  }
}

/**
 * PUT /api/admin/users
 * Update single user role (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate and check admin role
    const user = await authenticateAPI()
    if (!user) {
      return AuthErrors.UNAUTHORIZED()
    }

    if (!hasRoleAccess(user.role, 'admin')) {
      return AuthErrors.FORBIDDEN('admin', user.role)
    }

    const body = await request.json()
    const { userId, role } = body

    // Validate request
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: `Invalid role: ${role}`, code: 'INVALID_ROLE' },
        { status: 400 }
      )
    }

    // Prevent admins from changing their own role to prevent lockout
    if (userId === user.userId && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role', code: 'SELF_ROLE_CHANGE' },
        { status: 403 }
      )
    }

    // Assign role
    const success = await assignUserRole(userId, role)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to assign role', code: 'ROLE_ASSIGNMENT_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned role '${role}' to user ${userId}`
    })
  } catch (error) {
    console.error('Error assigning role:', error)
    return AuthErrors.INTERNAL_ERROR('Failed to assign role')
  }
}
