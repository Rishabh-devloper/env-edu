'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  BarChart3, 
  Award,
  TrendingUp,
  Target,
  Calendar,
  MessageCircle,
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function TeacherDashboard() {
  const { user } = useUser()

  const teacherFeatures = [
    {
      title: 'My Students',
      description: 'Monitor student progress and engagement',
      icon: Users,
      href: '/teacher/students',
      color: 'bg-blue-500',
      count: '24 students',
      stats: 'Avg. Progress: 68%'
    },
    {
      title: 'Lesson Plans',
      description: 'Create and manage environmental curricula',
      icon: BookOpen,
      href: '/teacher/lessons',
      color: 'bg-green-500',
      count: '12 active plans',
      stats: '3 new this week'
    },
    {
      title: 'Task Review',
      description: 'Review and approve student submissions',
      icon: ClipboardCheck,
      href: '/teacher/reviews',
      color: 'bg-orange-500',
      count: '8 pending',
      stats: '2 high priority'
    },
    {
      title: 'Analytics',
      description: 'View class performance and insights',
      icon: BarChart3,
      href: '/teacher/analytics',
      color: 'bg-purple-500',
      count: 'Class Report',
      stats: 'Updated today'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-15 animate-pulse-delayed"></div>
      </div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Welcome, {user?.firstName}! 👩‍🏫
                </h1>
                <p className="text-blue-600 font-medium">
                  Inspiring Environmental Champions
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Lessons</p>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-orange-600">8</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Teacher Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teacherFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group"
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-200 group-hover:scale-105">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{feature.count}</span>
                        </div>
                        <p className="text-xs text-gray-500">{feature.stats}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Class Discussions</h3>
                <p className="text-sm text-gray-600 mb-4">Engage with students on environmental topics</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  View Forum
                </button>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Resource Library</h3>
                <p className="text-sm text-gray-600 mb-4">Access teaching materials and resources</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  Browse Resources
                </button>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Class Settings</h3>
                <p className="text-sm text-gray-600 mb-4">Manage assignments and grading preferences</p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  Manage Class
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
