'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/auth'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Shield, 
  Users, 
  Database, 
  BarChart3,
  Settings,
  AlertTriangle,
  Activity,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  UserCheck,
  Flag,
  Monitor,
  Server,
  Globe,
  Zap,
  FileText,
  UserPlus
} from 'lucide-react'

export default function AdminLandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, isAdmin } = useUserRole()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemAlerts: 0,
    pendingReports: 0,
    dailyActivity: 0,
    serverLoad: 0
  })
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (role && !isAdmin) {
      // Redirect to appropriate role page
      switch (role) {
        case 'student':
          router.push('/student')
          break
        case 'teacher':
          router.push('/teacher')
          break
        case 'ngo':
          router.push('/ngo')
          break
        default:
          router.push('/')
      }
    }
  }, [isLoaded, isSignedIn, role, isAdmin, router])

  // Load admin statistics
  useEffect(() => {
    const loadAdminStats = async () => {
      if (!isSignedIn || !isAdmin) return
      
      try {
        // You would replace this with actual API calls
        setStats({
          totalUsers: 1847,
          activeUsers: 892,
          systemAlerts: 3,
          pendingReports: 7,
          dailyActivity: 2156,
          serverLoad: 67
        })
      } catch (error) {
        console.error('Error loading admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAdminStats()
  }, [isSignedIn, isAdmin])

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (!isSignedIn || !isAdmin) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome,
              <span className="text-slate-700"> Administrator!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage the platform, monitor system health, oversee users, 
              and ensure smooth operations across the environmental education ecosystem.
            </p>
          </div>

          {/* System Status Alert */}
          {stats.systemAlerts > 0 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">System Alerts</h3>
                  <p className="text-yellow-700">
                    You have {stats.systemAlerts} system alerts that require attention.
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/admin/alerts')}
                  className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  View Alerts
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers.toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Today</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <Flag className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.pendingReports}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Pending Reports</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <Server className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.serverLoad}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Server Load</h3>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* User Management Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Oversee all platform users</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900">Total Users</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900">Active Users</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Manage Users
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* System Analytics Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
                  <p className="text-gray-600">Monitor platform performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900">Daily Activities</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.dailyActivity.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Server className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="font-medium text-gray-900">Server Load</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{stats.serverLoad}%</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/admin/analytics')}
                className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                View Analytics
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => router.push('/admin/reports')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Moderation</h3>
              <p className="text-gray-600 text-sm">
                Review user reports and moderate platform content
              </p>
              {stats.pendingReports > 0 && (
                <div className="mt-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {stats.pendingReports} pending
                </div>
              )}
            </button>

            <button
              onClick={() => router.push('/admin/settings')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600 text-sm">
                Configure platform settings and feature toggles
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/monitoring')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Monitor system health and performance metrics
              </p>
            </button>
          </div>

          {/* System Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Database</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">99.9%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Status</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">Healthy</p>
              <p className="text-sm text-gray-600">All endpoints active</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-1">2.1s</p>
              <p className="text-sm text-gray-600">Avg response time</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">Secure</p>
              <p className="text-sm text-gray-600">All checks passed</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Activity className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent System Activity</h2>
                  <p className="text-gray-600">Latest platform events and changes</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/admin/activity')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New user registrations spike</p>
                  <p className="text-sm text-gray-600">47 new users registered in the last hour • 5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Database className="w-5 h-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Database backup completed successfully</p>
                  <p className="text-sm text-gray-600">All data backed up to secure storage • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">System maintenance scheduled</p>
                  <p className="text-sm text-gray-600">Planned downtime for updates on Sunday 2 AM • 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
