'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { useUserProgress, useTasks, useBadges, useLeaderboard } from '@/hooks/useUserData'
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Award, 
  BookOpen, 
  Play, 
  Camera, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Zap,
  Globe,
  TreePine,
  Recycle,
  BarChart3,
  Star,
  MapPin,
  Calendar,
  Shield,
  GraduationCap
} from 'lucide-react'

export default function Features() {
  const { isSignedIn, user } = useUser()
  const { isStudent, isTeacher, isNGO, isAdmin, role } = useUserRole()
  const { progress, loading: progressLoading } = useUserProgress()
  const { tasks, loading: tasksLoading } = useTasks()
  const { earnedBadges, loading: badgesLoading } = useBadges()
  const { leaderboard, userRank, loading: leaderboardLoading } = useLeaderboard()

  // Show different content based on user role
  const getRoleSpecificTitle = () => {
    if (!isSignedIn) return 'Comprehensive Environmental Learning Platform'
    if (isStudent) return `Welcome back, ${user?.firstName}! Continue Your Eco-Learning Journey`
    if (isTeacher) return 'Empower Your Students with Environmental Education Tools'
    if (isNGO) return 'Drive Environmental Impact Through School Partnerships'
    if (isAdmin) return 'Platform Administration & Analytics Dashboard'
    return 'Environmental Learning Platform'
  }

  const getRoleSpecificDescription = () => {
    if (!isSignedIn) return 'Transforming environmental education through interactive learning, gamification, real-world tasks, and community engagement'
    if (isStudent) return 'Track your progress, complete eco-tasks, earn badges, and compete with classmates while making real environmental impact'
    if (isTeacher) return 'Create engaging content, monitor student progress, assign eco-tasks, and track your class environmental contributions'
    if (isNGO) return 'Partner with schools, launch campaigns, track community impact, and empower the next generation of environmental leaders'
    if (isAdmin) return 'Manage users, monitor platform activity, generate reports, and oversee the environmental education ecosystem'
    return 'Join thousands in making environmental education engaging and impactful'
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            {getRoleSpecificTitle()}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getRoleSpecificDescription()}
          </p>
          
          {/* User Progress Indicators (for signed-in users) */}
          {isSignedIn && progress && (
            <div className="flex justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-800">{progress.totalPoints}</span>
                <span className="text-gray-600">Points</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
                <Trophy className="w-5 h-5 text-green-500" />
                <span className="font-bold text-gray-800">Level {progress.level}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-800">{progress.streak} Day Streak</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Interactive Learning */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Interactive Learning</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Play className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Video-based Lessons</p>
                  <p className="text-sm text-gray-600">Engaging multimedia content on climate change, pollution, and sustainability</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Interactive Modules</p>
                  <p className="text-sm text-gray-600">Hands-on activities and simulations for better understanding</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-teal-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Local Context Focus</p>
                  <p className="text-sm text-gray-600">India-specific environmental challenges and solutions</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              {isSignedIn && progress ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-blue-800">
                      {progress.completedLessons.length} of {progress.totalLessons} Lessons Completed
                    </p>
                    <span className="text-sm text-blue-600">{Math.round(progress.completionRate)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${progress.completionRate}%`}}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-blue-800">156+ Learning Modules Available</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </>
              )}
            </div>

            <Link href="/learning" className="block mt-6">
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isSignedIn ? 'Access Learning Hub' : 'Explore Learning'}
              </button>
            </Link>
          </div>

          {/* Gamification System */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Gamification & Rewards</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Eco-Points System</p>
                  <p className="text-sm text-gray-600">Earn points for completing lessons, quizzes, and real-world tasks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Digital Badges</p>
                  <p className="text-sm text-gray-600">Collect badges for achievements like "Tree Planter", "Eco Warrior"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Leaderboards</p>
                  <p className="text-sm text-gray-600">Compete with classmates and schools across India</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-yellow-700">Points</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-purple-700">Badges</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-green-700">Ranking</p>
              </div>
            </div>

            <Link href={isSignedIn ? '/gamification' : '/sign-up'} className="block mt-6">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isSignedIn ? 'View Leaderboard' : 'Start Earning Points'}
              </button>
            </Link>
          </div>

          {/* Real-World Tasks */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Real-World Tasks</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <TreePine className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Tree Planting</p>
                  <p className="text-sm text-gray-600">Plant trees and track their growth with photo updates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Camera className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Environmental Documentation</p>
                  <p className="text-sm text-gray-600">Report local pollution and environmental issues</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Recycle className="w-5 h-5 text-teal-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Waste Management</p>
                  <p className="text-sm text-gray-600">Organize recycling drives and waste reduction campaigns</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              {isSignedIn && progress ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-orange-800">Your Impact</p>
                    <span className="text-sm text-orange-600">{progress.completedTasks.length} tasks completed!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{progress.completedTasks.filter(id => tasks.find(t => t.id === id)?.category === 'conservation').length}</p>
                      <p className="text-xs text-gray-600">Conservation Tasks</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{progress.completedTasks.filter(id => tasks.find(t => t.id === id)?.category === 'awareness').length}</p>
                      <p className="text-xs text-gray-600">Awareness Tasks</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-orange-800">Community Impact</p>
                    <span className="text-sm text-orange-600">1,250 trees planted!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">15kg</p>
                      <p className="text-xs text-gray-600">Waste Recycled</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">89</p>
                      <p className="text-xs text-gray-600">Reports Filed</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href={isSignedIn ? '/tasks' : '/sign-up'} className="block mt-6">
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isSignedIn ? 'View Tasks' : 'Start Contributing'}
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Tracking Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-green-200 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              Comprehensive Progress Tracking
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitor learning progress, environmental impact, and community contributions with detailed analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Individual Progress */}
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-green-800 mb-2">Individual Progress</h4>
              <p className="text-sm text-green-600 mb-4">Track personal learning journey and environmental contributions</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Lessons Completed</span>
                  <span className="text-xs font-medium">18/25</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>
            </div>

            {/* School Rankings */}
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-blue-800 mb-2">School Competitions</h4>
              <p className="text-sm text-blue-600 mb-4">Compare with other schools and participate in eco-challenges</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-sm font-medium">Your School Rank</span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-purple-800 mb-2">Environmental Impact</h4>
              <p className="text-sm text-purple-600 mb-4">Measure real-world contributions to environmental conservation</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-bold text-green-600">3</p>
                  <p className="text-gray-600">Trees Planted</p>
                </div>
                <div>
                  <p className="font-bold text-blue-600">15kg</p>
                  <p className="text-gray-600">Waste Recycled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href={isSignedIn ? (isTeacher ? '/teacher/dashboard' : '/student/dashboard') : '/sign-up'}>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isSignedIn ? 'View Progress Dashboard' : 'Start Tracking Progress'}
              </button>
            </Link>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Collaboration Tools */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Community Collaboration</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Study Groups & Discussion Forums</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Peer-to-Peer Knowledge Sharing</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Teacher-Student Interaction</span>
              </div>
            </div>
          </div>

          {/* NGO Integration */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-teal-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">NGO Partnerships</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-medium">Local Environmental Campaigns</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">School-NGO Collaboration Projects</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Real-world Impact Measurement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Platform Impact Statistics</h3>
            <p className="text-green-100">Real numbers from our growing community</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,145</div>
              <div className="text-sm opacity-80">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">48</div>
              <div className="text-sm opacity-80">Partner Schools</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,250</div>
              <div className="text-sm opacity-80">Trees Planted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-sm opacity-80">Student Engagement</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={isSignedIn ? '/learning' : '/sign-up'}>
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
                {isSignedIn ? 'Continue Learning' : 'Join EcoLearning Today'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
