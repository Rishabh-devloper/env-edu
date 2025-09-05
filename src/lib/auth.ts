import { useUser } from '@clerk/nextjs'
import { UserRole } from '@/types'

export const useUserRole = () => {
  const { user } = useUser()
  
  if (!user) {
    return { role: null, isAuthenticated: false }
  }

  const role = user.publicMetadata?.role as UserRole || 'student'
  
  return {
    role,
    isAuthenticated: true,
    isStudent: role === 'student',
    isTeacher: role === 'teacher',
    isNGO: role === 'ngo',
    isAdmin: role === 'admin'
  }
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
  switch (role) {
    case 'student':
      return '/student/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'ngo':
      return '/ngo/dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/dashboard'
  }
}
