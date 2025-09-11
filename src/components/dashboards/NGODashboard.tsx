'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  Globe, 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar,
  MapPin,
  Heart,
  Award,
  BarChart3,
  MessageSquare,
  Camera,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function NGODashboard() {
  const { user } = useUser()

  const ngoFeatures = [
    {
      title: 'Campaigns',
      description: 'Manage environmental awareness campaigns',
      icon: Globe,
      href: '/ngo/campaigns',
      color: 'bg-green-500',
      count: '5 active',
      stats: '2,450 participants'
    },
    {
      title: 'Community Impact',
      description: 'Track environmental initiatives and results',
      icon: TrendingUp,
      href: '/ngo/impact',
      color: 'bg-blue-500',
      count: '12 projects',
      stats: '500 trees planted'
    },
    {
      title: 'Reports & Data',
      description: 'Generate impact reports and analytics',
      icon: FileText,
      href: '/ngo/reports',
      color: 'bg-purple-500',
      count: '8 reports',
      stats: 'Monthly summary ready'
    },
    {
      title: 'Events',
      description: 'Organize environmental awareness events',
      icon: Calendar,
      href: '/ngo/events',
      color: 'bg-orange-500',
      count: '3 upcoming',
      stats: 'Next: Earth Day Cleanup'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-teal-200 rounded-full blur-3xl opacity-15 animate-pulse-delayed"></div>
      </div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Welcome, {user?.firstName}! 🌍
                </h1>
                <p className="text-green-600 font-medium">
                  Creating Environmental Impact Together
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-green-600">5</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                  <p className="text-3xl font-bold text-blue-600">2,450</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trees Planted</p>
                  <p className="text-3xl font-bold text-orange-600">500</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impact Score</p>
                  <p className="text-3xl font-bold text-purple-600">92%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* NGO Tools */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">NGO Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ngoFeatures.map((feature) => {
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

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-sm text-gray-600 mb-4">Engage with volunteers and supporters</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  Join Discussion
                </button>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Document Impact</h3>
                <p className="text-sm text-gray-600 mb-4">Upload photos and stories of your work</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Upload Content
                </button>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate Report</h3>
                <p className="text-sm text-gray-600 mb-4">Create impact reports for stakeholders</p>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
