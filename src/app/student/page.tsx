'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/auth'
import { useEnhancedUserData, useEnhancedTasks, useEnhancedBadges } from '@/hooks/useEnhancedData'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import BadgeCard from '@/components/gamification/BadgeCard'
import TaskCard from '@/components/tasks/TaskCard'
import LessonCard from '@/components/content/LessonCard'
import CertificateCard from '@/components/rewards/CertificateCard'
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Star,
  Leaf,
  Users,
  Clock,
  ArrowRight,
  Trophy,
  Zap,
  Play,
  Download,
  Eye,
  Crown,
  Gem,
  Plus,
  Gamepad2,
  Globe,
  TreePine,
  Camera,
  Recycle,
  BarChart3
} from 'lucide-react'

export default function StudentLandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, isStudent } = useUserRole()
  const router = useRouter()
  
  const { userProgress, loading: progressLoading } = useEnhancedUserData()
  const { tasks, userSubmissions, loading: tasksLoading, submitTask } = useEnhancedTasks()
  const { allBadges, userBadges, loading: badgesLoading } = useEnhancedBadges()
  
  // Local state for additional features
  const [lessons, setLessons] = useState([])
  const [certificates, setCertificates] = useState([])
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [showAllBadges, setShowAllBadges] = useState(false)
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [showAllLessons, setShowAllLessons] = useState(false)
  const [selectedView, setSelectedView] = useState('overview')

  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    // Only redirect if user has a role assigned and it's NOT student
    // If no role is assigned, allow access to student dashboard (assume student)
    if (role && role !== 'student') {
      // Redirect to appropriate role page
      switch (role) {
        case 'teacher':
          router.push('/teacher')
          break
        case 'ngo':
          router.push('/ngo')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          // If role is unrecognized, stay on student page
          break
      }
    }
  }, [isLoaded, isSignedIn, role, isStudent, router])

  // Load lessons data
  useEffect(() => {
    const loadLessons = async () => {
      if (!isSignedIn || (role && role !== 'student')) return
      
      try {
        const response = await fetch('/api/lessons?limit=6')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setLessons(data.data || [])
          }
        }
      } catch (error) {
        console.error('Error loading lessons:', error)
      } finally {
        setLessonsLoading(false)
      }
    }

    loadLessons()
  }, [isSignedIn, isStudent])

  // Mock certificates data (you can replace with actual API call)
  useEffect(() => {
    if (isSignedIn && (!role || role === 'student')) {
      setCertificates([
        {
          id: '1',
          title: 'Climate Action Champion',
          description: 'Completed advanced climate change course',
          type: 'completion',
          issuedAt: '2024-01-15T10:00:00Z',
          validUntil: '2025-01-15T10:00:00Z'
        },
        {
          id: '2', 
          title: 'Eco Warrior',
          description: 'Completed 10 environmental tasks',
          type: 'achievement',
          issuedAt: '2024-01-10T10:00:00Z'
        }
      ])
    }
  }, [isSignedIn, isStudent])

  if (!isLoaded || progressLoading || tasksLoading || badgesLoading) {
    return <LoadingSpinner />
  }

  // Only block access if signed in but has a different role (not student)
  if (!isSignedIn || (role && role !== 'student')) {
    return <LoadingSpinner />
  }

  const completedTasks = userSubmissions.filter(submission => 
    submission.status === 'approved'
  ).length || 0

  const pendingTasks = tasks.length - completedTasks
  const earnedBadges = userBadges?.length || 0
  const availableBadgesCount = allBadges?.length || 0
  const completedLessons = userProgress?.completedLessonsCount || 0

  // Handler functions
  const handleTaskUpload = async (taskId, file, description) => {
    try {
      const result = await submitTask({
        taskId,
        description,
        photos: [file.name], // In real implementation, upload file first
        location: null
      })
      if (result.success) {
        console.log('Task submitted successfully')
      }
    } catch (error) {
      console.error('Error submitting task:', error)
    }
  }

  const handleLessonStart = (lessonId) => {
    router.push(`/learning/lessons/${lessonId}`)
  }

  const handleCertificateDownload = (certificateId) => {
    console.log('Downloading certificate:', certificateId)
    // Implement certificate download logic
  }

  const handleCertificateView = (certificateId) => {
    console.log('Viewing certificate:', certificateId)
    // Implement certificate view logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome Back, 
              <span className="text-green-600"> Eco Warrior!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Continue your journey to make a positive impact on our planet. 
              Track your progress, complete eco-tasks, and earn rewards!
            </p>
          </div>


          {/* Enhanced Rewards Overview */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 rounded-3xl shadow-2xl p-8 text-white mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">🏆 Your Achievements</h2>
                <p className="text-purple-100 text-lg">Track your environmental impact rewards</p>
              </div>
              <div className="text-center bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{userProgress?.totalPoints || 0}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-2xl font-bold mb-1">{earnedBadges}</div>
                <div className="text-sm opacity-90">Badges Earned</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-2xl font-bold mb-1">#{Math.max(1, 8 - Math.floor((userProgress?.totalPoints || 0) / 200))}</div>
                <div className="text-sm opacity-90">Global Rank</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-2xl font-bold mb-1">Level {userProgress?.level || 1}</div>
                <div className="text-sm opacity-90">Current Level</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          {/* Showcase Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Your Environmental Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress, complete eco-tasks, earn badges, and compete with classmates while making real environmental impact
            </p>
          </div>

          {/* Main Feature Showcase Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Interactive Learning Card */}
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
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-blue-800">
                    {completedLessons} of {lessons.length} Lessons Completed
                  </p>
                  <span className="text-sm text-blue-600">{lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0}%`}}
                  ></div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/learning')}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🎓 Access Learning Hub
              </button>
            </div>

            {/* Gamification System Card */}
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
                  <p className="text-xs font-medium text-yellow-700">{userProgress?.totalPoints || 0}</p>
                  <p className="text-xs text-gray-600">Points</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-purple-700">{earnedBadges}</p>
                  <p className="text-xs text-gray-600">Badges</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-green-700">Rank #7</p>
                  <p className="text-xs text-gray-600">Position</p>
                </div>
              </div>

              <button 
                onClick={() => router.push('/gamification')}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🏆 View Leaderboard
              </button>
            </div>

            {/* Real-World Tasks Card */}
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-orange-800">Your Impact</p>
                  <span className="text-sm text-orange-600">{completedTasks} tasks completed!</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">{tasks.filter(t => t.category === 'tree_planting' && userSubmissions.find(s => s.taskId === t.id && s.status === 'approved')).length}</p>
                    <p className="text-xs text-gray-600">Trees Planted</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{tasks.filter(t => t.category === 'waste_management' && userSubmissions.find(s => s.taskId === t.id && s.status === 'approved')).length}</p>
                    <p className="text-xs text-gray-600">Cleanup Tasks</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/tasks')}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🌱 View Tasks
              </button>
            </div>
          </div>

          {/* Platform Impact Statistics */}
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Your Environmental Impact</h3>
              <p className="text-green-100">Making a difference, one action at a time</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{completedTasks}</div>
                <div className="text-sm opacity-80">Tasks Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{earnedBadges}</div>
                <div className="text-sm opacity-80">Badges Earned</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{completedTasks * 25}</div>
                <div className="text-sm opacity-80">XP Earned</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{Math.max(1, Math.ceil((userProgress?.totalPoints || 0) / 100))}</div>
                <div className="text-sm opacity-80">Current Level</div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setSelectedView('overview')}
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🌟 View Full Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-lg border border-gray-100">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'learning', label: 'Learning', icon: BookOpen },
              { id: 'gamification', label: 'Achievements', icon: Trophy },
              { id: 'tasks', label: 'Tasks', icon: Target },
              { id: 'rewards', label: 'Rewards', icon: Award }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedView === tab.id
                      ? 'bg-green-500 text-white shadow'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Based on Selected View */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setSelectedView('learning')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn & Explore</h3>
              <p className="text-gray-600 text-sm mb-2">
                Discover environmental topics and expand your knowledge
              </p>
              <div className="text-emerald-600 font-medium text-sm">
                {completedLessons} lessons completed
              </div>
            </button>

            <button
              onClick={() => setSelectedView('gamification')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-gray-600 text-sm mb-2">
                View your badges, leaderboards, and compare progress
              </p>
              <div className="text-yellow-600 font-medium text-sm">
                {earnedBadges}/{availableBadgesCount} badges earned
              </div>
            </button>

            <button
              onClick={() => setSelectedView('tasks')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco Tasks</h3>
              <p className="text-gray-600 text-sm mb-2">
                Complete environmental challenges and earn rewards
              </p>
              <div className="text-blue-600 font-medium text-sm">
                {completedTasks}/{tasks.length} tasks completed
              </div>
            </button>
          </div>
        )}

        {/* Interactive Learning Section */}
        {selectedView === 'learning' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Interactive Learning Hub</h2>
              <button
                onClick={() => router.push('/learning')}
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                Explore All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Learning Progress Overview */}
            <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Your Learning Journey</h3>
                <div className="flex items-center text-emerald-600">
                  <Zap className="w-5 h-5 mr-1" />
                  <span className="font-medium">{userProgress?.totalPoints || 0} XP</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{completedLessons}</div>
                  <div className="text-sm text-gray-600">Lessons Complete</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Play className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.type === 'video').length}</div>
                  <div className="text-sm text-gray-600">Videos Watched</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.type === 'interactive').length}</div>
                  <div className="text-sm text-gray-600">Interactive Done</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{Math.round((completedLessons / (lessons.length || 1)) * 100)}%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
              </div>
              
              {/* Weekly Learning Goal */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Weekly Learning Goal</span>
                  <span className="text-sm text-gray-600">5/7 lessons</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">2 more lessons to reach your weekly goal! 🎯</p>
              </div>
            </div>

            {/* Interactive Learning Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Climate Science', icon: '🌡️', lessons: lessons.filter(l => l.tags?.includes('climate')).length, color: 'bg-blue-50 border-blue-200' },
                  { name: 'Renewable Energy', icon: '⚡', lessons: lessons.filter(l => l.tags?.includes('energy')).length, color: 'bg-yellow-50 border-yellow-200' },
                  { name: 'Conservation', icon: '🌿', lessons: lessons.filter(l => l.tags?.includes('conservation')).length, color: 'bg-green-50 border-green-200' },
                  { name: 'Sustainability', icon: '♻️', lessons: lessons.filter(l => l.tags?.includes('sustainability')).length, color: 'bg-purple-50 border-purple-200' }
                ].map(category => (
                  <div key={category.name} className={`${category.color} border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer`}>
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm">{category.name}</h4>
                    <p className="text-xs text-gray-600">{category.lessons} lessons</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Interactive Lessons */}
            {lessonsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading interactive lessons...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Interactive Lessons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.slice(0, 6).map(lesson => (
                    <div key={lesson.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            lesson.type === 'video' ? 'bg-blue-100 text-blue-600' :
                            lesson.type === 'interactive' ? 'bg-purple-100 text-purple-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {lesson.type === 'video' ? <Play className="w-6 h-6" /> :
                             lesson.type === 'interactive' ? <Zap className="w-6 h-6" /> :
                             <BookOpen className="w-6 h-6" />}
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {lesson.duration || 15}min
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {lesson.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {lesson.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{lesson.ecoPoints || 50} XP</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.type === 'interactive' ? '🎮 Interactive' : lesson.type === 'video' ? '📹 Video' : '📖 Reading'}
                          </div>
                        </div>
                        
                        {userProgress?.completedLessons?.includes(lesson.id) ? (
                          <div className="flex items-center text-green-600 mb-4">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Continue where you left off</p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleLessonStart(lesson.id)}
                          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                            userProgress?.completedLessons?.includes(lesson.id)
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                          }`}
                          disabled={userProgress?.completedLessons?.includes(lesson.id)}
                        >
                          {userProgress?.completedLessons?.includes(lesson.id) ? 'Completed ✓' : 
                           lesson.type === 'interactive' ? '🎮 Start Interactive' :
                           lesson.type === 'video' ? '▶️ Watch Video' : '📖 Read Lesson'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Gamification Section */}
        {selectedView === 'gamification' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🏆 Achievement Center</h2>
              <button
                onClick={() => router.push('/gamification')}
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                Full Leaderboard <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Gamification Stats Overview */}
            <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">🎮 Your Gaming Stats</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userProgress?.level || 1}</div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userProgress?.totalPoints || 0}</div>
                    <div className="text-xs text-gray-600">XP</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{earnedBadges}</div>
                  <div className="text-xs text-gray-600">Badges Earned</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{completedTasks}</div>
                  <div className="text-xs text-gray-600">Tasks Done</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{completedLessons}</div>
                  <div className="text-xs text-gray-600">Lessons</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{userProgress?.streak?.current || 0}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Level {userProgress?.level || 1} Progress</span>
                  <span className="text-sm text-gray-600">
                    {userProgress?.totalPoints || 0}/{userProgress?.nextLevelPoints || 100} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(
                        ((userProgress?.totalPoints || 0) / (userProgress?.nextLevelPoints || 100)) * 100, 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {(userProgress?.nextLevelPoints || 100) - (userProgress?.totalPoints || 0)} XP to Level {(userProgress?.level || 1) + 1}! 🚀
                </p>
              </div>
            </div>

            {/* Achievement Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Achievement Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Learning Master', icon: '📚', earned: userBadges?.filter(b => allBadges?.find(ab => ab.id === b.badgeId)?.category === 'knowledge').length || 0, total: allBadges?.filter(b => b.category === 'knowledge').length || 0, color: 'bg-blue-50 border-blue-200' },
                  { name: 'Eco Warrior', icon: '🌱', earned: userBadges?.filter(b => allBadges?.find(ab => ab.id === b.badgeId)?.category === 'eco_action').length || 0, total: allBadges?.filter(b => b.category === 'eco_action').length || 0, color: 'bg-green-50 border-green-200' },
                  { name: 'Team Player', icon: '🤝', earned: userBadges?.filter(b => allBadges?.find(ab => ab.id === b.badgeId)?.category === 'community').length || 0, total: allBadges?.filter(b => b.category === 'community').length || 0, color: 'bg-purple-50 border-purple-200' },
                  { name: 'Leader', icon: '👑', earned: userBadges?.filter(b => allBadges?.find(ab => ab.id === b.badgeId)?.category === 'leadership').length || 0, total: allBadges?.filter(b => b.category === 'leadership').length || 0, color: 'bg-yellow-50 border-yellow-200' }
                ].map(category => (
                  <div key={category.name} className={`${category.color} border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group`}>
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h4>
                    <div className="text-xs text-gray-600 mb-2">{category.earned}/{category.total} earned</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${category.total > 0 ? (category.earned / category.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Achievements Showcase */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎉 Recent Achievements</h3>
              {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBadges.slice(0, 6).map(userBadge => {
                    const badge = allBadges?.find(b => b.id === userBadge.badgeId)
                    return badge ? (
                      <div key={userBadge.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                        {/* Sparkle Animation */}
                        <div className="absolute top-2 right-2 text-yellow-400 animate-pulse">
                          ✨
                        </div>
                        
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            badge.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            badge.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            badge.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            'bg-gray-500'
                          } text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <span className="text-2xl">{badge.icon}</span>
                          </div>
                          
                          <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                          
                          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${
                              badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                              badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                              badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {badge.rarity}
                            </span>
                            <span>🎯 {badge.pointsRequired} XP</span>
                          </div>
                          
                          <div className="mt-3 text-xs text-green-600">
                            Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <div className="text-6xl mb-4">🏆</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Start Your Achievement Journey!</h4>
                  <p className="text-gray-500 mb-6">Complete lessons and tasks to earn your first badges!</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setSelectedView('learning')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      📚 Start Learning
                    </button>
                    <button
                      onClick={() => setSelectedView('tasks')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      🎯 View Tasks
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Next Badges to Unlock */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Next Badges to Unlock</h3>
              {allBadges && allBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allBadges
                    .filter(badge => !userBadges?.some(ub => ub.badgeId === badge.id))
                    .sort((a, b) => {
                      const progressA = Math.min((userProgress?.totalPoints || 0) / a.pointsRequired * 100, 100)
                      const progressB = Math.min((userProgress?.totalPoints || 0) / b.pointsRequired * 100, 100)
                      return progressB - progressA
                    })
                    .slice(0, 6)
                    .map(badge => {
                      const progress = Math.min((userProgress?.totalPoints || 0) / badge.pointsRequired * 100, 100)
                      return (
                        <div key={badge.id} className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 p-6 hover:shadow-xl hover:border-green-300 transition-all duration-300 group">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-gray-100 group-hover:bg-gray-200 transition-colors">
                              <span className="text-2xl opacity-50 group-hover:opacity-75 transition-opacity">🔒</span>
                            </div>
                            
                            <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
                            <p className="text-xs text-gray-600 mb-4">{badge.description}</p>
                            
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {badge.pointsRequired - (userProgress?.totalPoints || 0)} XP needed
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full ${
                                badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                                badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {badge.rarity}
                              </span>
                              <span>🎯 {badge.pointsRequired} XP</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading badges...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-World Tasks Section */}
        {selectedView === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🌍 Real-World Environmental Tasks</h2>
              <button
                onClick={() => router.push('/tasks')}
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                Explore All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Task Stats Overview */}
            <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">🎯 Your Impact Dashboard</h3>
                <div className="flex items-center text-green-600">
                  <Leaf className="w-5 h-5 mr-1" />
                  <span className="font-medium">Making a Difference!</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{completedTasks}</div>
                  <div className="text-xs text-gray-600">Tasks Completed</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{userSubmissions.filter(s => s.status === 'pending').length}</div>
                  <div className="text-xs text-gray-600">Under Review</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{tasks.length - completedTasks}</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{completedTasks * 25}</div>
                  <div className="text-xs text-gray-600">Impact Points</div>
                </div>
              </div>
              
              {/* Monthly Challenge Progress */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">🏆 Monthly Eco Challenge</span>
                  <span className="text-sm text-gray-600">{completedTasks}/10 tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((completedTasks / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {10 - completedTasks > 0 ? `${10 - completedTasks} more tasks to complete this month's challenge! 🌟` : 'Monthly challenge completed! 🎉'}
                </p>
              </div>
            </div>

            {/* Task Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Task Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Tree Planting', icon: '🌳', tasks: tasks.filter(t => t.category === 'tree_planting').length, color: 'bg-green-50 border-green-200 text-green-700' },
                  { name: 'Waste Management', icon: '♻️', tasks: tasks.filter(t => t.category === 'waste_management').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { name: 'Energy Conservation', icon: '⚡', tasks: tasks.filter(t => t.category === 'energy_conservation').length, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                  { name: 'Water Conservation', icon: '💧', tasks: tasks.filter(t => t.category === 'water_conservation').length, color: 'bg-cyan-50 border-cyan-200 text-cyan-700' }
                ].map(category => (
                  <div key={category.name} className={`${category.color} border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group`}>
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{category.name}</h4>
                    <p className="text-xs opacity-75">{category.tasks} available tasks</p>
                  </div>
                ))}
              </div>
            </div>
            
            {tasksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading real-world tasks...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎆 Featured Environmental Tasks</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {tasks.slice(0, 4).map(task => {
                    const submission = userSubmissions.find(s => s.taskId === task.id)
                    const isCompleted = submission?.status === 'approved'
                    const isPending = submission?.status === 'pending'
                    
                    return (
                      <div key={task.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="p-6">
                          {/* Task Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              task.category === 'tree_planting' ? 'bg-green-100 text-green-600' :
                              task.category === 'waste_management' ? 'bg-blue-100 text-blue-600' :
                              task.category === 'energy_conservation' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-cyan-100 text-cyan-600'
                            }`}>
                              <span className="text-xl">
                                {task.category === 'tree_planting' ? '🌳' :
                                 task.category === 'waste_management' ? '♻️' :
                                 task.category === 'energy_conservation' ? '⚡' : '💧'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {isCompleted && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Completed
                                </span>
                              )}
                              {isPending && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center">
                                  <Clock className="w-3 h-3 mr-1" /> Under Review
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {task.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {task.description}
                          </p>
                          
                          {/* Task Details */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {task.ecoPoints} XP
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                ~{task.estimatedTime}min
                              </div>
                              <div className="flex items-center">
                                {task.requirements?.photoRequired && '📷'}
                                {task.requirements?.locationRequired && '📍'}
                                {task.requirements?.verificationType === 'teacher' && '👩‍🏫'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress or Action */}
                          {isCompleted ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center text-green-700">
                                <Trophy className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Task Completed! Great work! 🎉</span>
                              </div>
                              {submission?.feedback && (
                                <p className="text-xs text-green-600 mt-1">💬 {submission.feedback}</p>
                              )}
                            </div>
                          ) : isPending ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <div className="flex items-center text-orange-700">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Submission under review 🔍</span>
                              </div>
                              <p className="text-xs text-orange-600 mt-1">Submitted on {new Date(submission?.submittedAt).toLocaleDateString()}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => router.push(`/tasks/${task.id}`)}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
                            >
                              <span>🚀 Start This Task</span>
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Quick Task Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => router.push('/tasks?category=tree_planting')}
                    className="p-4 bg-green-50 border border-green-200 rounded-xl text-left hover:bg-green-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🌳</span>
                      <div>
                        <h4 className="font-semibold text-green-800">Plant Trees Today</h4>
                        <p className="text-xs text-green-600">Help restore our forests</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/tasks?category=waste_management')}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">♻️</span>
                      <div>
                        <h4 className="font-semibold text-blue-800">Clean Up Spaces</h4>
                        <p className="text-xs text-blue-600">Reduce waste in your area</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/tasks?category=energy_conservation')}
                    className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-left hover:bg-yellow-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">⚡</span>
                      <div>
                        <h4 className="font-semibold text-yellow-800">Save Energy</h4>
                        <p className="text-xs text-yellow-600">Reduce your carbon footprint</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rewards & Competition Section */}
        {selectedView === 'rewards' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🏆 Rewards & Competition</h2>
              <div className="flex items-center space-x-2">
                <Gem className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-medium text-purple-600">{userProgress?.totalPoints || 0} Points</span>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">🌟 Global Eco Champions</h3>
                  <div className="flex items-center text-purple-600">
                    <Trophy className="w-5 h-5 mr-1" />
                    <span className="font-medium">This Month</span>
                  </div>
                </div>
                
                {/* Top 3 Podium */}
                <div className="flex justify-center items-end space-x-4 mb-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <span className="text-xl font-bold text-white">2</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border">
                      <div className="text-sm font-semibold text-gray-800">Sarah M.</div>
                      <div className="text-xs text-gray-600">2,450 XP</div>
                    </div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-xl border-2 border-yellow-300">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-yellow-200">
                      <div className="text-base font-bold text-gray-800">Alex K.</div>
                      <div className="text-sm text-gray-600">3,120 XP</div>
                      <div className="text-xs text-yellow-600 font-medium mt-1">👑 Champion</div>
                    </div>
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <span className="text-xl font-bold text-white">3</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border">
                      <div className="text-sm font-semibold text-gray-800">Mike T.</div>
                      <div className="text-xs text-gray-600">2,100 XP</div>
                    </div>
                  </div>
                </div>
                
                {/* Your Rank */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">7</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Your Rank</div>
                        <div className="text-sm text-gray-600">{userProgress?.totalPoints || 0} XP</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-700 font-medium">📈 +150 XP this week</div>
                      <div className="text-xs text-green-600">Only 200 XP to rank 6!</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Leaderboard */}
                <div className="mt-4 space-y-2">
                  {[
                    { rank: 4, name: 'Emma L.', points: 1850, trend: '+50' },
                    { rank: 5, name: 'David R.', points: 1720, trend: '+25' },
                    { rank: 6, name: 'Lisa W.', points: 1650, trend: '+75' },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">{user.rank}</span>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">{user.trend}</span>
                        <span className="text-sm text-gray-600">{user.points} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Friend Challenges */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🤝 Friend Challenges</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Weekly Tree Challenge</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Plant more trees than Sarah M. this week!</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">3</div>
                        <div className="text-xs text-gray-600">You</div>
                      </div>
                      <div className="text-center text-blue-600">
                        <span className="text-sm font-medium">VS</span>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">5</div>
                        <div className="text-xs text-gray-600">Sarah</div>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                      🌱 Plant More Trees
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Cleanup Champion</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">2 days left</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Complete 5 cleanup tasks before Mike T.!</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-3">
                      <span>3/5 completed</span>
                      <span>Mike: 2/5</span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                      ♻️ Find Cleanup Tasks
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Challenge a Friend
                  </button>
                </div>
              </div>
            </div>
            
            {/* Certificates & Rewards */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">🎆 Your Certificates & Achievements</h3>
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map(certificate => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={certificate}
                      onDownload={handleCertificateDownload}
                      onView={handleCertificateView}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates yet</h3>
                  <p className="text-gray-500 mb-4">Complete courses and achieve milestones to earn certificates!</p>
                  <button
                    onClick={() => setSelectedView('learning')}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    🎤 Start Learning Journey
                  </button>
                </div>
              )}
            </div>
            
            {/* Special Offers */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Limited Time Offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-amber-200 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">50% OFF</div>
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-800 mb-1">Eco Warrior Badge</h4>
                  <p className="text-sm text-gray-600 mb-3">Special achievement badge for completing 25 tasks</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">250 XP</span>
                      <span className="text-sm text-gray-500 line-through ml-2">500 XP</span>
                    </div>
                    <button className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                      Unlock Now
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-orange-200">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-semibold text-gray-800 mb-1">Premium Features</h4>
                  <p className="text-sm text-gray-600 mb-3">Unlock advanced analytics and exclusive tasks</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Free for 1 month</span>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                      Try Free
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  )
}
