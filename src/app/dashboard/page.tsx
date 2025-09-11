'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole, getRoleBasedRedirect } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Dashboard() {
  const { isLoaded } = useUser()
  const { role, isAuthenticated } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated) {
        router.push('/sign-in')
      } else {
        // Redirect authenticated users to main landing page where they'll see role-specific content
        router.push('/')
      }
    }
  }, [isLoaded, isAuthenticated, router])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  return <LoadingSpinner />
}
