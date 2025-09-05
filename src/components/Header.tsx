'use client'

import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'

export default function Header() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-800">EcoLearning</span>
          </div>
          
          {/* Navigation and Auth */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                Home
              </Link>
              {isSignedIn && (
                <>
                  {isStudent && (
                    <Link href="/student/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
                      Student Dashboard
                    </Link>
                  )}
                  {isTeacher && (
                    <Link href="/teacher/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
                      Teacher Dashboard
                    </Link>
                  )}
                  {isNGO && (
                    <Link href="/ngo/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
                      NGO Dashboard
                    </Link>
                  )}
                </>
              )}
              <Link href="/demo" className="text-gray-600 hover:text-green-600 transition-colors">
                Demo
              </Link>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Contact
              </a>
            </nav>
            
            {/* Authentication */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
