'use client'

import { useState, useEffect } from 'react'
import { SignUp, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { UserRole } from '@/types'
import RoleSelector from '@/components/auth/RoleSelector'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  ArrowLeft, 
  Leaf, 
  TreePine, 
  Waves,
  Sun,
  Cloud,
  Sparkles
} from 'lucide-react'

type SignUpStep = 'role-selection' | 'clerk-signup' | 'completing'

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('role-selection')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isAssigningRole, setIsAssigningRole] = useState(false)
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Check if user just completed signup and assign role
  useEffect(() => {
    if (isLoaded && user && selectedRole && currentStep === 'clerk-signup') {
      assignRoleToUser()
    }
  }, [isLoaded, user, selectedRole, currentStep])

  const assignRoleToUser = async () => {
    if (!user || !selectedRole) return

    setCurrentStep('completing')
    setIsAssigningRole(true)

    try {
      // Assign role to user via API
      const response = await fetch('/api/auth/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      const result = await response.json()
      
      if (result.success) {
        setIsAssigningRole(false)
        // Small delay to show completion state
        setTimeout(() => {
          // Redirect to appropriate dashboard
          const dashboardRoutes = {
            student: '/student/dashboard',
            teacher: '/teacher/dashboard',
            ngo: '/ngo/dashboard',
            admin: '/admin/dashboard'
          }
          router.push(dashboardRoutes[selectedRole])
        }, 2000)
      } else {
        console.error('Role assignment failed:', result.error)
        setIsAssigningRole(false)
        // If role assignment fails, still redirect but with default role
        setTimeout(() => {
          router.push('/student/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error assigning role:', error)
      setIsAssigningRole(false)
      setTimeout(() => {
        router.push('/student/dashboard')
      }, 2000)
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleProceedToSignUp = () => {
    if (selectedRole) {
      setCurrentStep('clerk-signup')
    }
  }

  const handleBackToRoleSelection = () => {
    setCurrentStep('role-selection')
  }

  if (currentStep === 'completing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Leaf className="w-8 h-8 text-green-300 opacity-60" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <TreePine className="w-12 h-12 text-green-400 opacity-40" />
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce-slow">
            <Sparkles className="w-10 h-10 text-yellow-300 opacity-50" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
          <div className="max-w-md w-full text-center space-y-8 bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-green-100">
            <div className="space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                {isAssigningRole ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-b-transparent"></div>
                ) : (
                  <CheckCircle className="w-12 h-12 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  {isAssigningRole ? 'Setting up your account...' : 'Welcome to EcoLearning! 🌱'}
                </h2>
                <p className="mt-3 text-lg text-gray-600">
                  {isAssigningRole 
                    ? `Configuring your ${selectedRole} dashboard` 
                    : 'Your account has been created successfully!'
                  }
                </p>
              </div>
              {!isAssigningRole && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">Redirecting to your dashboard...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'role-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Leaf className="w-8 h-8 text-green-300 opacity-60" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <TreePine className="w-12 h-12 text-green-400 opacity-40" />
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce-slow">
            <Waves className="w-10 h-10 text-teal-300 opacity-50" />
          </div>
          <div className="absolute top-60 right-40 animate-pulse">
            <Sun className="w-16 h-16 text-yellow-300 opacity-30" />
          </div>
          <div className="absolute bottom-40 right-10 animate-float">
            <Cloud className="w-14 h-14 text-blue-200 opacity-40" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse-delayed"></div>
        </div>
        
        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800 font-medium group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Join EcoLearning
                </h2>
              </div>
              <p className="text-xl text-gray-700 mb-3">
                Start your environmental sustainability journey today
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-green-100">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <span className="text-green-700 font-medium">Choose your role</span>
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                  2
                </div>
                <span className="text-gray-500">Create account</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 mb-8">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleProceedToSignUp}
                disabled={!selectedRole}
                className={`
                  flex items-center space-x-2 px-10 py-4 rounded-2xl font-medium text-white transition-all duration-200 shadow-lg
                  ${selectedRole 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span>Continue to Sign Up</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Clerk signup step
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Leaf className="w-8 h-8 text-green-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <TreePine className="w-12 h-12 text-green-400 opacity-40" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-slow">
          <Sparkles className="w-10 h-10 text-yellow-300 opacity-50" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Role Summary */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-12 group">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">EcoLearning</h1>
                <p className="text-green-100 text-sm">Sustainable Future</p>
              </div>
            </Link>

            {/* Role Info */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">You're joining as:</h3>
                <div className="text-3xl font-bold text-green-200 capitalize mb-2">
                  {selectedRole}
                </div>
                <p className="text-green-100">
                  {selectedRole === 'student' && 'Learn sustainability, earn eco-points, and make environmental impact'}
                  {selectedRole === 'teacher' && 'Create educational content and guide students in environmental learning'}
                  {selectedRole === 'ngo' && 'Launch campaigns and track environmental impact across schools'}
                  {selectedRole === 'admin' && 'Manage the platform and oversee environmental education initiatives'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">What you'll get:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Personalized dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Environmental impact tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Community collaboration tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
          {/* Progress & Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={handleBackToRoleSelection}
              className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800 font-medium group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Change Role</span>
            </button>
            
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-green-100">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                ✓
              </div>
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                2
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              You're signing up as a <strong className="text-green-600 capitalize">
                {selectedRole}
              </strong>. Enter your details to get started.
            </p>
          </div>

          {/* Sign Up Component */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white/80 backdrop-blur-lg shadow-2xl border border-green-100 rounded-2xl',
                    headerTitle: 'text-2xl font-bold text-green-800',
                    headerSubtitle: 'text-green-600',
                    socialButtonsBlockButton: 'border-green-200 hover:bg-green-50 text-green-700 rounded-xl transition-all duration-200 hover:scale-105',
                    formButtonPrimary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl',
                    formFieldInput: 'border-green-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white/50 backdrop-blur-sm',
                    formFieldLabel: 'text-green-700 font-medium',
                    footerActionLink: 'text-green-600 hover:text-green-700 font-medium'
                  },
                  layout: {
                    shimmer: false
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
