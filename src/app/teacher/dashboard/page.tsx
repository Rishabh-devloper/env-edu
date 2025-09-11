'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  Users, 
  BookOpen, 
  Target, 
  BarChart3, 
  Plus, 
  Eye, 
  CheckCircle, 
  TreePine,
  Recycle,
  Zap,
  Droplets,
  Award,
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  Download,
  Share2,
  Filter,
  Search,
  MapPin,
  Camera
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TeacherDashboard() {
  const { user, isLoaded } = useUser()
  const { role, isTeacher } = useUserRole()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'students' | 'challenges' | 'analytics' | 'projects'>('overview')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isTeacher) {
      router.push('/')
    }
  }, [isLoaded, isTeacher, router])

  // Fetch teacher dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        // In a real app, this would fetch from your API
        // For now, we'll use mock data that represents comprehensive environmental education tracking
        const mockData = {
          stats: {
            totalStudents: 45,
            activeClasses: 3,
            totalLessons: 24,
            activeTasks: 8,
            pendingReviews: 5,
            classAvgPoints: 1420,
            monthlyGrowth: 15,
            completionRate: 87,
            totalEcoPoints: 63900,
            activeStudents: 42
          },
          environmentalImpact: {
            treesPlanted: 156,
            wasteRecycled: 234, // kg
            energySaved: 1890, // kWh
            waterConserved: 4320, // liters
            carbonOffset: 890 // kg CO2
          },
          recentSubmissions: [
            {
              id: '1',
              studentName: 'Arjun Sharma',
              taskTitle: 'Plant a Tree Challenge',
              submittedAt: '2 hours ago',
              status: 'pending',
              type: 'tree_planting',
              points: 50
            },
            {
              id: '2',
              studentName: 'Priya Patel',
              taskTitle: 'Plastic Waste Segregation',
              submittedAt: '1 day ago',
              status: 'approved',
              type: 'waste_management',
              points: 30
            },
            {
              id: '3',
              studentName: 'Rahul Kumar',
              taskTitle: 'Solar Energy Awareness',
              submittedAt: '2 days ago',
              status: 'pending',
              type: 'energy_conservation',
              points: 40
            }
          ],
          topPerformers: [
            { name: 'Meera Singh', points: 2340, badge: 'Eco Champion', class: 'Class 8A' },
            { name: 'Karan Joshi', points: 2180, badge: 'Green Leader', class: 'Class 8B' },
            { name: 'Anita Reddy', points: 2050, badge: 'Planet Protector', class: 'Class 8A' }
          ],
          activeProjects: [
            {
              id: '1',
              title: 'School Garden Initiative',
              description: 'Creating a sustainable vegetable garden',
              participants: 23,
              progress: 75,
              deadline: '2024-02-15',
              category: 'agriculture'
            },
            {
              id: '2',
              title: 'Rainwater Harvesting',
              description: 'Installing rainwater collection system',
              participants: 18,
              progress: 45,
              deadline: '2024-03-01',
              category: 'water_conservation'
            }
          ]
        }
        setDashboardData(mockData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isTeacher) {
      fetchDashboardData()
    }
  }, [isLoaded, isTeacher])

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (!isTeacher) {
    return null
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'tree_planting': return <TreePine className="w-4 h-4" />
      case 'waste_management': return <Recycle className="w-4 h-4" />
      case 'energy_conservation': return <Zap className="w-4 h-4" />
      case 'water_conservation': return <Droplets className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'approved' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
  }

  if (!dashboardData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  Environmental Education Hub, {user?.firstName}! 🌱
                </h1>
                <p className="text-gray-600">Manage eco-learning activities and track environmental impact</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'challenges', label: 'Eco-Challenges', icon: Target },
                { id: 'analytics', label: 'Impact Analytics', icon: TrendingUp },
                { id: 'projects', label: 'Projects', icon: MapPin }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-green-800">{dashboardData.stats.activeStudents}</p>
                    <p className="text-xs text-green-600">{dashboardData.stats.activeClasses} classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Eco-Lessons</p>
                    <p className="text-2xl font-bold text-blue-800">{dashboardData.stats.totalLessons}</p>
                    <p className="text-xs text-blue-600">87% completion</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-purple-800">{dashboardData.stats.activeTasks}</p>
                    <p className="text-xs text-purple-600">{dashboardData.stats.pendingReviews} pending</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Points</p>
                    <p className="text-2xl font-bold text-orange-800">{dashboardData.stats.classAvgPoints}</p>
                    <p className="text-xs text-orange-600">+{dashboardData.stats.monthlyGrowth}% this month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-green-800">🌍 Collective Environmental Impact</h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  Export Report
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TreePine className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">{dashboardData.environmentalImpact.treesPlanted}</div>
                  <div className="text-sm text-gray-600">Trees Planted</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Recycle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{dashboardData.environmentalImpact.wasteRecycled} kg</div>
                  <div className="text-sm text-gray-600">Waste Recycled</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">{dashboardData.environmentalImpact.energySaved} kWh</div>
                  <div className="text-sm text-gray-600">Energy Saved</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">{dashboardData.environmentalImpact.waterConserved} L</div>
                  <div className="text-sm text-gray-600">Water Saved</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">{dashboardData.environmentalImpact.carbonOffset} kg</div>
                  <div className="text-sm text-gray-600">CO₂ Offset</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Submissions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Task Submissions</h3>
                    <Link href="/teacher/submissions" className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.recentSubmissions.map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            submission.type === 'tree_planting' ? 'bg-green-100 text-green-600' :
                            submission.type === 'waste_management' ? 'bg-blue-100 text-blue-600' :
                            submission.type === 'energy_conservation' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-cyan-100 text-cyan-600'
                          }`}>
                            {getTaskIcon(submission.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{submission.studentName}</p>
                            <p className="text-sm text-gray-600">{submission.taskTitle}</p>
                            <p className="text-xs text-gray-500">{submission.submittedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(submission.status)
                          }`}>
                            {submission.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          {submission.status === 'pending' && (
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Eco-Challenge
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add Learning Module
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Start Local Project
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </button>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Eco Champions</h3>
                  <div className="space-y-3">
                    {dashboardData.topPerformers.map((student: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            'bg-orange-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.class} • {student.badge}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{student.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional tabs content would go here */}
        {selectedTab !== 'overview' && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Section
            </h3>
            <p className="text-gray-600">
              This section is under development. It will include comprehensive tools for managing {selectedTab}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
