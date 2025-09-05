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
      } else if (role) {
        router.push(getRoleBasedRedirect(role))
      }
    }
  }, [isLoaded, isAuthenticated, role, router])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  return <LoadingSpinner />
}
