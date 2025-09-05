'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  BarChart3, 
  Award, 
  Globe, 
  Users, 
  Settings,
  Home,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function QuickNav() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()
  const [isOpen, setIsOpen] = useState(false)

  const quickLinks = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      color: 'text-gray-600'
    },
    {
      icon: BookOpen,
      label: 'Lessons',
      href: isSignedIn ? (isStudent ? '/student/dashboard' : '/teacher/dashboard') : '/sign-up',
      color: 'text-blue-600'
    },
    {
      icon: Trophy,
      label: 'Leaderboard',
      href: isSignedIn ? (isStudent ? '/student/dashboard' : '/teacher/dashboard') : '/sign-up',
      color: 'text-yellow-600'
    },
    {
      icon: Target,
      label: 'Tasks',
      href: isSignedIn ? (isStudent ? '/student/dashboard' : '/teacher/dashboard') : '/sign-up',
      color: 'text-green-600'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: isSignedIn ? (isTeacher ? '/teacher/dashboard' : '/student/dashboard') : '/sign-up',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      label: 'Rewards',
      href: isSignedIn ? '/student/dashboard' : '/sign-up',
      color: 'text-orange-600'
    },
    {
      icon: Globe,
      label: 'Community',
      href: isSignedIn ? (isNGO ? '/ngo/dashboard' : '/teacher/dashboard') : '/sign-up',
      color: 'text-teal-600'
    }
  ]

  if (!isSignedIn) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Quick Nav Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <Users className="w-5 h-5" />
          <span className="hidden sm:block">Quick Access</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Links Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[200px]">
            <div className="space-y-1">
              {quickLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className={`w-4 h-4 ${link.color}`} />
                    <span className="text-sm font-medium text-gray-700">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
