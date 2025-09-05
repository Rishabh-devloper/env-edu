'use client'

import { CheckCircle, Leaf, Globe } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'

export default function Hero() {
  const { isSignedIn, user } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 leading-tight">
              {isSignedIn ? `Welcome back, ${user?.firstName || 'EcoWarrior'}!` : 'Learn About Environmental Sustainability'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {isSignedIn 
                ? 'Continue your sustainability journey with personalized quizzes and challenges.' 
                : 'Engage in quizzes, challenges, and eco-tasks to earn points and badges.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isSignedIn ? (
                <>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Get Started Free
                  </button>
                  <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200">
                    Learn More
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  {isStudent && (
                    <a href="/student/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl text-center">
                      Student Dashboard
                    </a>
                  )}
                  {isTeacher && (
                    <a href="/teacher/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl text-center">
                      Teacher Dashboard
                    </a>
                  )}
                  {isNGO && (
                    <a href="/ngo/dashboard" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl text-center">
                      NGO Dashboard
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Character */}
              <div className="relative z-10">
                <div className="w-80 h-80 bg-green-100 rounded-full flex items-center justify-center relative overflow-hidden">
                  {/* Character Illustration */}
                  <div className="relative">
                    {/* Head */}
                    <div className="w-32 h-32 bg-green-200 rounded-full relative mb-4">
                      {/* Glasses */}
                      <div className="absolute top-8 left-4 w-24 h-8 bg-green-600 rounded-full opacity-80"></div>
                      {/* Eyes */}
                      <div className="absolute top-10 left-6 w-2 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-10 right-6 w-2 h-2 bg-white rounded-full"></div>
                      {/* Smile */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-green-800 rounded-full border-t-0"></div>
                    </div>
                    
                    {/* Body */}
                    <div className="w-24 h-32 bg-green-300 rounded-t-full mx-auto"></div>
                    
                    {/* Arms holding globe */}
                    <div className="absolute -top-4 left-8 w-16 h-8 bg-green-200 rounded-full transform rotate-12"></div>
                    <div className="absolute -top-4 right-8 w-16 h-8 bg-green-200 rounded-full transform -rotate-12"></div>
                  </div>
                  
                  {/* Globe */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-800 rounded-full flex items-center justify-center">
                    <Globe className="w-12 h-12 text-green-200" />
                  </div>
                </div>
              </div>
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
