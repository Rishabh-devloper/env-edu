'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/auth'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  PlusCircle,
  GraduationCap,
  ClipboardList,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  Settings
} from 'lucide-react'

export default function TeacherLandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, isTeacher } = useUserRole()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    pendingSubmissions: 0,
    tasksCreated: 0
  })
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (role && !isTeacher) {
      // Redirect to appropriate role page
      switch (role) {
        case 'student':
          router.push('/student')
          break
        case 'ngo':
          router.push('/ngo')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/')
      }
    }
  }, [isLoaded, isSignedIn, role, isTeacher, router])

  // Load teacher statistics
  useEffect(() => {
    const loadTeacherStats = async () => {
      if (!isSignedIn || !isTeacher) return
      
      try {
        // You would replace this with actual API calls
        setStats({
          totalStudents: 24,
          activeClasses: 3,
          pendingSubmissions: 12,
          tasksCreated: 8
        })
      } catch (error) {
        console.error('Error loading teacher stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTeacherStats()
  }, [isSignedIn, isTeacher])

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (!isSignedIn || !isTeacher) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome Back,
              <span className="text-blue-600"> Educator!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empower the next generation of environmental stewards. 
              Monitor progress, create engaging content, and inspire change.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <GraduationCap className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.activeClasses}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Classes</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <ClipboardList className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.pendingSubmissions}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Pending Reviews</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.tasksCreated}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Tasks Created</h3>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Classroom Management Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Classroom Hub</h2>
                  <p className="text-gray-600">Manage students and track progress</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900">Active Students</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-900">Need Review</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stats.pendingSubmissions}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                View Full Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Content Creation Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <PlusCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Content</h2>
                  <p className="text-gray-600">Design engaging eco-activities</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900">Tasks Created</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.tasksCreated}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="font-medium text-gray-900">Active Classes</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{stats.activeClasses}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/teacher/create-task')}
                className="w-full mt-6 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                Create New Task
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/teacher/analytics')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600 text-sm">
                View detailed insights on student performance and engagement
              </p>
            </button>

            <button
              onClick={() => router.push('/teacher/submissions')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Submissions</h3>
              <p className="text-gray-600 text-sm">
                Review and approve student task submissions and provide feedback
              </p>
            </button>

            <button
              onClick={() => router.push('/teacher/settings')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Settings</h3>
              <p className="text-gray-600 text-sm">
                Configure class settings, student groups, and grading criteria
              </p>
            </button>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-gray-600">Latest updates from your classroom</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/teacher/activity')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Sarah completed "Plant a Tree" task</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <ClipboardList className="w-5 h-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New submission pending review</p>
                  <p className="text-sm text-gray-600">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">3 new students joined your class</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
