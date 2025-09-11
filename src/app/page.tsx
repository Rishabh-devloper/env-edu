'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import RoleShowcase from '@/components/RoleShowcase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, isStudent, isTeacher, isNGO, isAdmin } = useUserRole()
  const router = useRouter()

  // Redirect authenticated users to their role-specific landing pages
  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      // If user has a role, redirect to appropriate page
      if (role) {
        switch (role) {
          case 'student':
            router.push('/student')
            break
          case 'teacher':
            router.push('/teacher')
            break
          case 'ngo':
            router.push('/ngo')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            // If role is not recognized, stay on main landing page
            break
        }
      } else {
        // If no role is assigned, default to student dashboard
        // This helps users who signed up but didn't complete role assignment
        router.push('/student')
      }
    }
  }, [isLoaded, isSignedIn, role, router])

  // Show loading while checking authentication or redirecting
  if (!isLoaded || isSignedIn) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-15 animate-pulse-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100 to-green-100 rounded-full blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        <Hero />
      </div>
      
      {/* Features Section */}
      <Features />
      
      {/* Role Showcase Section */}
      <RoleShowcase />
      
    </main>
  )
}
