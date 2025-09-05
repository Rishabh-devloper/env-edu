'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { Globe, Users, Target, TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NGODashboard() {
  const { user, isLoaded } = useUser()
  const { role, isNGO } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isNGO) {
      router.push('/')
    }
  }, [isLoaded, isNGO, router])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isNGO) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            NGO Dashboard, {user?.firstName}! 🌍
          </h1>
          <p className="text-gray-600">
            Track your environmental impact and manage community initiatives.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schools Connected</p>
                <p className="text-2xl font-bold text-green-800">12</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Reached</p>
                <p className="text-2xl font-bold text-blue-800">1,250</p>
                <p className="text-xs text-blue-600">+150 this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-purple-800">8</p>
                <p className="text-xs text-purple-600">3 completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-orange-800">9.2</p>
                <p className="text-xs text-orange-600">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Performance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-800">Campaign Performance</h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Tree Planting Initiative</p>
                      <p className="text-sm text-gray-500">500 trees planted across 5 schools</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">95% Complete</p>
                    <p className="text-xs text-gray-500">475/500 trees</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Ocean Cleanup Drive</p>
                      <p className="text-sm text-gray-500">Beach cleaning in 3 coastal schools</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">78% Complete</p>
                    <p className="text-xs text-gray-500">156/200 students</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Recycling Awareness</p>
                      <p className="text-sm text-gray-500">Educational workshops in 8 schools</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">100% Complete</p>
                    <p className="text-xs text-gray-500">320 students trained</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Impact Metrics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Launch New Campaign
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Connect School
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">Impact Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CO2 Reduced (kg)</span>
                  <span className="text-sm font-bold text-green-600">2,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Waste Diverted (kg)</span>
                  <span className="text-sm font-bold text-green-600">1,890</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water Saved (L)</span>
                  <span className="text-sm font-bold text-green-600">15,600</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Community Reach</span>
                  <span className="text-sm font-bold text-green-600">5,200</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Earth Day Workshop</p>
                    <p className="text-xs text-gray-500">April 22, 2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">School Visit - Green Valley</p>
                    <p className="text-xs text-gray-500">April 25, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
