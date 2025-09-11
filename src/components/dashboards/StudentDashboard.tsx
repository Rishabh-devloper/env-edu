'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  TrendingUp, 
  Award,
  Zap,
  Users,
  CheckCircle,
  Play,
  ArrowRight,
  Leaf,
  Globe,
  TreePine,
  Recycle,
  Camera
} from 'lucide-react'
import NotificationCenter from '@/components/notifications/NotificationCenter'
import LiveLeaderboard from '@/components/leaderboards/LiveLeaderboard'
import ActivityFeed from '@/components/activity/ActivityFeed'
import { useEnhancedUserData } from '@/hooks/useEnhancedData'
import Link from 'next/link'

export default function StudentDashboard() {
  const { user } = useUser()

  const {
    userProgress,
    badges,
    notifications,
    loading,
    error,
    refreshData
  } = useEnhancedUserData({
    enablePolling: true,
    pollingInterval: 30000
  })

  // Get real data from hooks
  const stats = {
    totalPoints: userProgress?.totalPoints || 0,
    level: userProgress?.level || 1,
    currentStreak: userProgress?.currentStreak || 0,
    completedLessons: userProgress?.completedLessonsCount || 0,
    badgesEarned: badges?.userBadges?.length || 0,
    completionRate: userProgress?.completionRate || 0,
    tasksCompleted: userProgress?.tasks?.completed || 0,
    tasksPending: userProgress?.tasks?.pending || 0
  }

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your environmental education journey',
      icon: BookOpen,
      href: '/learning',
      color: 'bg-blue-500',
      count: `${stats.completedLessons} lessons completed`
    },
    {
      title: 'Complete Tasks',
      description: 'Take on real-world environmental challenges',
      icon: Target,
      href: '/tasks',
      color: 'bg-green-500',
      count: 'New tasks available'
    },
    {
      title: 'View Progress',
      description: 'Track your environmental impact',
      icon: TrendingUp,
      href: '/gamification',
      color: 'bg-purple-500',
      count: `Level ${stats.level}`
    },
    {
      title: 'Achievements',
      description: 'See your badges and accomplishments',
      icon: Trophy,
      href: '/gamification?tab=badges',
      color: 'bg-yellow-500',
      count: `${stats.badgesEarned} badges`
    }
  ]

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
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
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-700">Level {stats.level} - {stats.level >= 8 ? 'Eco Champion' : stats.level >= 5 ? 'Green Warrior' : 'Eco Explorer'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-700">{stats.currentStreak} Day Streak!</span>
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
                  <p className="text-3xl font-bold text-green-800">{stats.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-green-600">Eco Points</p>
                </div>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: `${Math.min((stats.totalPoints % 500) / 5, 100)}%`}}></div>
              </div>
              <p className="text-xs text-green-600 font-medium">{500 - (stats.totalPoints % 500)} points to next level</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-800">{stats.completedLessons}</p>
                  <p className="text-sm text-blue-600">Lessons Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-blue-600 font-medium">{stats.completionRate}% completion rate</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-800">{stats.badgesEarned}</p>
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
                  <p className="text-3xl font-bold text-orange-800">{stats.tasksCompleted}</p>
                  <p className="text-sm text-orange-600">Real Tasks Done</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-orange-600 font-medium">{stats.tasksPending} tasks pending review</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group"
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-200 group-hover:scale-105">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{action.count}</span>
                        <Play className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200">
                <ActivityFeed 
                  showGlobalActivity={false}
                  maxItems={6}
                  className="shadow-none border-0 bg-transparent"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mini Leaderboard */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Class Ranking</h3>
                    <Link 
                      href="/gamification?tab=leaderboard"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <LiveLeaderboard 
                    scope="class"
                    period="weekly"
                    maxEntries={5}
                    showRankChanges={false}
                    className="shadow-none border-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
                
                <div className="space-y-4">
                  {/* Level Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Level {stats.level} Progress</span>
                      <span className="text-sm text-gray-500">{stats.totalPoints}/500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((stats.totalPoints % 500) / 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                      <span className="text-sm text-gray-500">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🎯 Next Steps</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Complete 2 more lessons to reach Level {stats.level + 1}</li>
                    <li>• Maintain your streak for streak bonus</li>
                    <li>• Submit a task to earn more eco-points</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
