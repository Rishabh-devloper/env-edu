'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  Leaf, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  BarChart3, 
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  User,
  ChevronDown
} from 'lucide-react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import NotificationCenter from './notifications/NotificationCenter'

export default function Header() {
  const { isSignedIn, user } = useUser()
  const { isStudent, isTeacher, isNGO, isAdmin, role } = useUserRole()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignIn = () => {
    router.push('/sign-in')
  }

  const handleSignUp = () => {
    router.push('/sign-up')
  }

  // Always use main landing page for dashboard - it will show role-specific content
  const dashboardLink = '/'

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home, show: true },
    { name: 'Learning', href: '/learning', icon: BookOpen, show: isSignedIn },
    { name: 'Dashboard', href: dashboardLink, icon: BarChart3, show: isSignedIn },
  ].filter(item => item.show)

  return (
    <>
      <header className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 backdrop-blur-lg shadow-lg border-b border-green-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Leaf className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  EcoLearning
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Sustainable Future
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-green-700 hover:bg-white/80 hover:text-green-800 hover:shadow-md transition-all duration-200 font-medium group"
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            
            {/* User Section */}
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <>
                  {/* Notification Center */}
                  <NotificationCenter className="" />
                  
                  <div className="relative" ref={userMenuRef}>
                  {/* User Menu Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
                  >
                    {/* Welcome Message */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-green-800">
                        Welcome back!
                      </p>
                      <p className="text-xs text-green-600 capitalize">
                        {user?.firstName} • {role}
                      </p>
                    </div>
                    
                    {/* Enhanced User Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {user?.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt={user.firstName || 'User'} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {user?.firstName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-green-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-100 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-green-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            {user?.imageUrl ? (
                              <img 
                                src={user.imageUrl} 
                                alt={user.firstName || 'User'} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold">
                                {user?.firstName?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-green-600 capitalize">
                              {role} Account
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.emailAddresses?.[0]?.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href={dashboardLink}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BarChart3 className="w-5 h-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        
                        <Link
                          href="/learning"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="w-5 h-5" />
                          <span className="font-medium">Learning Hub</span>
                        </Link>
                        
                        <button
                          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5" />
                          <span className="font-medium">Settings</span>
                        </button>
                      </div>
                      
                      {/* Sign Out */}
                      <div className="border-t border-green-100 py-2">
                        <SignOutButton>
                          <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium">
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                          </button>
                        </SignOutButton>
                      </div>
                    </div>
                  )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSignIn}
                    className="flex items-center space-x-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-white/50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                  
                  <button
                    onClick={handleSignUp}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Get Started</span>
                  </button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/50 hover:bg-white/80 text-green-700 hover:text-green-800 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-green-100">
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {isSignedIn ? (
                <div className="pt-3 border-t border-green-100 space-y-2">
                  {/* User Info in Mobile */}
                  <div className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        {user?.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt={user.firstName || 'User'} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {user?.firstName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-green-600 capitalize">
                          {role} Account
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <SignOutButton>
                    <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 font-medium">
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <div className="pt-3 border-t border-green-100 space-y-2">
                  <button
                    onClick={() => {
                      handleSignIn()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleSignUp()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Get Started</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
