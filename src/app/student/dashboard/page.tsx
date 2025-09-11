'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  Trophy, 
  Target, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar,
  Play,
  MapPin,
  Users,
  Zap,
  Star,
  Leaf,
  Globe,
  Camera,
  CheckCircle,
  ArrowRight,
  Gamepad2,
  TreePine,
  Recycle
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function StudentDashboard() {
  const { user, isLoaded } = useUser()
  const { role, isStudent } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isStudent) {
      router.push('/')
    }
  }, [isLoaded, isStudent, router])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isStudent) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-15 animate-pulse-delayed"></div>
      </div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}! 🌱
                </h1>
                <p className="text-green-600 font-medium">
                  Your Environmental Impact Journey
                </p>
              </div>
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-700">Level 8 - Eco Champion</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-700">5 Day Streak!</span>
              </div>
            </div>
          </div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-800">1,875</p>
                  <p className="text-sm text-green-600">Eco Points</p>
                </div>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-green-600 font-medium">125 points to next level</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-800">18</p>
                  <p className="text-sm text-blue-600">Lessons Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-blue-600 font-medium">3 interactive videos watched today</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-800">12</p>
                  <p className="text-sm text-purple-600">Badges Earned</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <TreePine className="w-3 h-3 text-white" />
                </div>
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Recycle className="w-3 h-3 text-white" />
                </div>
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">+</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-800">7</p>
                  <p className="text-sm text-orange-600">Real Tasks Done</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-orange-600 font-medium">2 tasks pending review</p>
              </div>
            </div>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Interactive Learning Hub */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-green-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-green-800 flex items-center">
                    <Gamepad2 className="w-6 h-6 mr-3 text-green-600" />
                    Interactive Learning Hub
                  </h2>
                  <Link href="/learning" className="text-green-600 hover:text-green-800 font-medium flex items-center space-x-2">
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Featured Lesson */}
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <Play className="w-5 h-5" />
                        <span className="text-sm font-medium opacity-90">NEW LESSON</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">Climate Change in India</h3>
                      <p className="text-sm opacity-90 mb-4">Interactive journey through India's climate challenges</p>
                      <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                        Start Learning
                      </button>
                    </div>
                    <Globe className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20" />
                  </div>

                  {/* Quiz Challenge */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-medium opacity-90">DAILY CHALLENGE</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">Eco Quiz Sprint</h3>
                      <p className="text-sm opacity-90 mb-4">5 questions, 60 seconds, big rewards!</p>
                      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                        Take Challenge
                      </button>
                    </div>
                    <Star className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20" />
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Current Module: Sustainable Living</span>
                    <span className="text-sm text-green-600">Progress: 68%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Tasks & Community */}
            <div className="space-y-6">
              {/* Real-World Tasks */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Real-World Tasks
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-orange-800 text-sm">Document Local Pollution</p>
                      <p className="text-xs text-orange-600">Take photos in your neighborhood</p>
                    </div>
                    <span className="text-xs font-bold text-orange-600">100 pts</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TreePine className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800 text-sm">Plant & Track a Tree</p>
                      <p className="text-xs text-green-600">Weekly progress updates</p>
                    </div>
                    <span className="text-xs font-bold text-green-600">200 pts</span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                    View All Tasks
                  </button>
                </div>
              </div>

              {/* School Leaderboard */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  School Leaderboard
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Arjun Sharma</p>
                        <p className="text-xs text-gray-600">Class 10-A</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-yellow-700">2,450 pts</span>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs text-yellow-600">Eco Leader</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Priya Patel</p>
                        <p className="text-xs text-gray-600">Class 10-B</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">2,180 pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-green-800 text-sm">You ({user?.firstName})</p>
                        <p className="text-xs text-green-600">Class 10-A • Rising Fast! ⚡</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-700">1,875 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                Recent Environmental Impact
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-green-800">3</p>
                <p className="text-sm text-green-600 font-medium">Trees Planted</p>
                <p className="text-xs text-green-500 mt-1">This Month</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-800">15kg</p>
                <p className="text-sm text-blue-600 font-medium">Waste Recycled</p>
                <p className="text-xs text-blue-500 mt-1">This Month</p>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-yellow-800">8</p>
                <p className="text-sm text-yellow-600 font-medium">Friends Inspired</p>
                <p className="text-xs text-yellow-500 mt-1">To Join EcoLearning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
