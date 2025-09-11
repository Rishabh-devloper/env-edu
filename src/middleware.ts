import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types'

// Define route matchers
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/demo(.*)',
  '/api/webhooks(.*)',
])

const isStudentRoute = createRouteMatcher([
  '/student(.*)',
  '/learning(.*)',
  '/gamification(.*)',
])

const isTeacherRoute = createRouteMatcher([
  '/teacher(.*)',
])

const isNGORoute = createRouteMatcher([
  '/ngo(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

const isAPIRoute = createRouteMatcher([
  '/api(.*)',
])

// Role-based access control
const checkRoleAccess = (userRole: string, request: NextRequest): boolean => {
  const { pathname } = request.nextUrl
  
  // Admin has access to everything
  if (userRole === 'admin') return true
  
  // Role-specific route access
  if (isStudentRoute(request) && userRole !== 'student') {
    // Teachers can access some student routes for monitoring
    if (userRole === 'teacher' && !pathname.includes('/student/dashboard')) {
      return true
    }
    return userRole === 'student'
  }
  
  if (isTeacherRoute(request)) {
    return userRole === 'teacher' || userRole === 'admin'
  }
  
  if (isNGORoute(request)) {
    return userRole === 'ngo' || userRole === 'admin'
  }
  
  if (isAdminRoute(request)) {
    return userRole === 'admin'
  }
  
  return true
}

const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'student': return '/student/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'ngo': return '/ngo/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/dashboard'
  }
}

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth()
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }
  
  // Redirect unauthenticated users to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Get user role from session claims
  const userRole = (sessionClaims?.metadata as any)?.role as UserRole || 'student'
  
  // Handle root dashboard redirect based on role
  if (pathname === '/dashboard' || pathname === '/') {
    if (userId) {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  }
  
  // Check role-based access
  if (!checkRoleAccess(userRole, request)) {
    // Redirect to appropriate dashboard if no access
    return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
  }
  
  // Handle API routes with role checking
  if (isAPIRoute(request)) {
    const response = NextResponse.next()
    response.headers.set('x-user-role', userRole)
    response.headers.set('x-user-id', userId)
    return response
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
