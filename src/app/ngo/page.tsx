'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/auth'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Globe, 
  Users, 
  TreePine, 
  Droplets,
  Recycle,
  Heart,
  TrendingUp,
  Calendar,
  MapPin,
  Target,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Megaphone,
  HandHeart,
  Leaf
} from 'lucide-react'

export default function NGOLandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, isNGO } = useUserRole()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    activeProjects: 0,
    volunteers: 0,
    communityImpact: 0,
    treesPlanted: 0
  })
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated or not an NGO
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (role && !isNGO) {
      // Redirect to appropriate role page
      switch (role) {
        case 'student':
          router.push('/student')
          break
        case 'teacher':
          router.push('/teacher')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/')
      }
    }
  }, [isLoaded, isSignedIn, role, isNGO, router])

  // Load NGO statistics
  useEffect(() => {
    const loadNGOStats = async () => {
      if (!isSignedIn || !isNGO) return
      
      try {
        // You would replace this with actual API calls
        setStats({
          activeProjects: 12,
          volunteers: 156,
          communityImpact: 2847,
          treesPlanted: 1523
        })
      } catch (error) {
        console.error('Error loading NGO stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNGOStats()
  }, [isSignedIn, isNGO])

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (!isSignedIn || !isNGO) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome Back,
              <span className="text-emerald-600"> Change Maker!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lead environmental initiatives, coordinate volunteers, 
              and track your community's positive impact on our planet.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.activeProjects}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.volunteers}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Volunteers</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.communityImpact.toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">People Reached</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <TreePine className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.treesPlanted.toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Trees Planted</h3>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Project Management Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Hub</h2>
                  <p className="text-gray-600">Manage environmental initiatives</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-emerald-500 mr-2" />
                    <span className="font-medium text-gray-900">Active Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">{stats.activeProjects}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900">Upcoming Events</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">7</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/ngo/dashboard')}
                className="w-full mt-6 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                View Full Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Community Impact Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Community Impact</h2>
                  <p className="text-gray-600">Track your environmental influence</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TreePine className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900">Trees Planted</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.treesPlanted.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-900">People Reached</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stats.communityImpact.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/ngo/impact')}
                className="w-full mt-6 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                View Impact Report
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => router.push('/ngo/projects/create')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <PlusCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Project</h3>
              <p className="text-gray-600 text-sm">
                Launch new environmental initiatives and recruit volunteers
              </p>
            </button>

            <button
              onClick={() => router.push('/ngo/volunteers')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <HandHeart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Volunteers</h3>
              <p className="text-gray-600 text-sm">
                Coordinate volunteer activities and track participation
              </p>
            </button>

            <button
              onClick={() => router.push('/ngo/analytics')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Hub</h3>
              <p className="text-gray-600 text-sm">
                Monitor performance metrics and environmental impact
              </p>
            </button>
          </div>

          {/* Environmental Initiatives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tree Planting</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">{stats.treesPlanted}</p>
              <p className="text-sm text-gray-600">Trees planted this year</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Conservation</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">850K</p>
              <p className="text-sm text-gray-600">Liters saved</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waste Management</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">2.3T</p>
              <p className="text-sm text-gray-600">Waste recycled</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Outreach</h3>
              <p className="text-3xl font-bold text-orange-600 mb-1">{stats.communityImpact}</p>
              <p className="text-sm text-gray-600">People educated</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-gray-600">Latest updates from your initiatives</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/ngo/activity')}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <TreePine className="w-5 h-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Community Tree Planting Event completed</p>
                  <p className="text-sm text-gray-600">150 trees planted at Riverside Park • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New volunteer registration wave</p>
                  <p className="text-sm text-gray-600">23 new volunteers joined this week • 5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <Megaphone className="w-5 h-5 text-purple-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Clean Water Campaign milestone reached</p>
                  <p className="text-sm text-gray-600">1M liters of water conserved this quarter • 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
