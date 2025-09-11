import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { assignUserRole, isValidRole } from '@/lib/role-assignment'
import { UserRole } from '@/types'

/**
 * POST /api/auth/assign-role
 * Assign role to current user (for sign-up flow)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user directly with Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    if (!role || !isValidRole(role)) {
      return NextResponse.json(
        { error: 'Valid role is required', code: 'INVALID_ROLE' },
        { status: 400 }
      )
    }

    // Assign role to the authenticated user
    const success = await assignUserRole(userId, role)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to assign role', code: 'ROLE_ASSIGNMENT_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Role '${role}' assigned successfully`,
      data: {
        userId: userId,
        role: role
      }
    })
  } catch (error) {
    console.error('Error assigning role:', error)
    return NextResponse.json(
      { error: 'Failed to assign role', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
