'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  Users, 
  BookOpen, 
  Target, 
  BarChart3, 
  Settings, 
  Shield,
  TrendingUp,
  Globe,
  Award,
  AlertTriangle,
  Activity,
  UserCheck
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const { role, isAdmin } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/')
    }
  }, [isLoaded, isAdmin, router])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Admin Dashboard, {user?.firstName}! 👨‍💼
          </h1>
          <p className="text-gray-600">
            Manage the entire EcoLearning platform and monitor system performance.
          </p>
        </div>

        {/* System Health Alert */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">System Status: All services operational</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-800">2,145</p>
                <p className="text-xs text-blue-600">+89 this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schools Connected</p>
                <p className="text-2xl font-bold text-green-800">48</p>
                <p className="text-xs text-green-600">12 NGO partnerships</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Content Items</p>
                <p className="text-2xl font-bold text-purple-800">156</p>
                <p className="text-xs text-purple-600">8 pending review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Platform Engagement</p>
                <p className="text-2xl font-bold text-orange-800">94.2%</p>
                <p className="text-xs text-orange-600">+2.1% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-800 text-lg">Students</h3>
              <p className="text-2xl font-bold text-blue-600">1,856</p>
              <p className="text-xs text-gray-500">86.5% of total users</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-green-800 text-lg">Teachers</h3>
              <p className="text-2xl font-bold text-green-600">245</p>
              <p className="text-xs text-gray-500">11.4% of total users</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-purple-800 text-lg">NGOs</h3>
              <p className="text-2xl font-bold text-purple-600">35</p>
              <p className="text-xs text-gray-500">1.6% of total users</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-orange-800 text-lg">Admins</h3>
              <p className="text-2xl font-bold text-orange-600">9</p>
              <p className="text-xs text-gray-500">0.4% of total users</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Platform Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-800">Recent Platform Activity</h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All Logs
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">New lesson "Solar Energy Basics" published</p>
                      <p className="text-sm text-gray-500">By Ms. Sarah Johnson • Green Valley School</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">25 new students registered</p>
                      <p className="text-sm text-gray-500">From Eco Warriors NGO partnership drive</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">4h ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Tree Planting Campaign milestone reached</p>
                      <p className="text-sm text-gray-500">500 trees planted across all participating schools</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">1d ago</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">System maintenance completed</p>
                      <p className="text-sm text-gray-500">Database optimization and security updates applied</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">2d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions & System Metrics */}
          <div className="space-y-6">
            {/* Admin Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Content Review
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </button>
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">System Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Server Uptime</span>
                  <span className="text-sm font-bold text-green-600">99.97%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-bold text-green-600">145ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-bold text-green-600">287</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm font-bold text-green-600">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Calls Today</span>
                  <span className="text-sm font-bold text-green-600">12,456</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 mb-4">System Alerts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">8 content items pending review</p>
                      <p className="text-xs text-yellow-600">Require admin approval</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">High engagement spike detected</p>
                      <p className="text-xs text-blue-600">+45% in last 24 hours</p>
                    </div>
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
