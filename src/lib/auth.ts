import { useUser } from '@clerk/nextjs'
import { UserRole } from '@/types'

/**
 * Hook to get the current user's role
 */
export function useUserRole() {
  const { user } = useUser();
  const role = user?.privateMetadata?.role as UserRole || 'student';
  
  return {
    role,
    isStudent: role === 'student',
    isTeacher: role === 'teacher',
    isNGO: role === 'ngo',
    isAdmin: role === 'admin',
  };
}

export const hasPermission = (userRole: UserRole, requiredRole: UserRole | UserRole[]) => {
  const roleHierarchy = {
    'student': 1,
    'teacher': 2,
    'ngo': 3,
    'admin': 4
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const getRoleBasedRedirect = (role: UserRole) => {
  // Always redirect to main landing page to show role-specific content
  return '/'
}
