import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { assignUserRole, isValidRole } from '@/lib/role-assignment'
import type { UserRole } from '@/types'

/**
 * POST /api/auth/assign-role
 * Assign role to current user (for sign-up flow)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user directly with Clerk
    const { userId } = await auth()
    console.log('Role assignment request for userId:', userId)
    
    if (!userId) {
      console.error('No userId found in auth')
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role }: { role: UserRole } = body
    console.log('Attempting to assign role:', role, 'to user:', userId)

    // Validate role
    if (!role || !isValidRole(role)) {
      console.error('Invalid role provided:', role)
      return NextResponse.json(
        { error: 'Valid role is required', code: 'INVALID_ROLE' },
        { status: 400 }
      )
    }
    
    console.log('Role validation passed for:', role)

    // Assign role to the authenticated user
    const success = await assignUserRole(userId, role)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to assign role', code: 'ROLE_ASSIGNMENT_FAILED' },
        { status: 500 }
      )
    }
    
    // Update user metadata with both private and public metadata for better access
    try {
      await clerkClient.users.updateUser(userId, {
        privateMetadata: { role },
        publicMetadata: { roleAssigned: true, assignedAt: new Date().toISOString() }
      })
    } catch (updateError) {
      console.error('Error updating user metadata:', updateError)
      // Continue as the role was already assigned in the assignUserRole function
    }

    return NextResponse.json({
      success: true,
      message: `Role '${role}' assigned successfully`,
      data: {
        userId,
        role,
        assignedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error assigning role:', error)
    return NextResponse.json(
      { error: 'Failed to assign role', code: 'INTERNAL_ERROR', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
