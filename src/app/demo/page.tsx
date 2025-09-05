'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  BarChart3, 
  Award, 
  Globe, 
  Users, 
  Play,
  Upload,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  const features = [
    {
      title: 'Interactive Learning',
      description: 'Engage with videos, infographics, and interactive lessons',
      icon: BookOpen,
      color: 'bg-blue-500',
      demo: 'Watch a 5-minute lesson on climate change',
      status: 'Available'
    },
    {
      title: 'Gamification System',
      description: 'Earn points, unlock badges, and compete on leaderboards',
      icon: Trophy,
      color: 'bg-yellow-500',
      demo: 'Complete a quiz and earn 50 eco-points',
      status: 'Available'
    },
    {
      title: 'Real-World Tasks',
      description: 'Complete environmental challenges and submit proof',
      icon: Target,
      color: 'bg-green-500',
      demo: 'Plant a tree and upload proof photo',
      status: 'Available'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor learning progress and performance analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
      demo: 'View detailed progress reports',
      status: 'Available'
    },
    {
      title: 'Reward System',
      description: 'Earn certificates and badges for achievements',
      icon: Award,
      color: 'bg-orange-500',
      demo: 'Generate completion certificates',
      status: 'Available'
    },
    {
      title: 'Community Impact',
      description: 'Connect with schools and track environmental impact',
      icon: Globe,
      color: 'bg-teal-500',
      demo: 'Launch environmental campaigns',
      status: 'Available'
    }
  ]

  const userDashboards = [
    {
      title: 'Student Dashboard',
      description: 'Interactive learning experience with gamification',
      icon: Users,
      color: 'bg-blue-100 text-blue-800',
      features: ['Lessons & Quizzes', 'Eco-Points & Badges', 'Task Submissions', 'Progress Tracking'],
      link: '/student/dashboard',
      available: isStudent || !isSignedIn
    },
    {
      title: 'Teacher Dashboard',
      description: 'Content creation and student monitoring tools',
      icon: BarChart3,
      color: 'bg-green-100 text-green-800',
      features: ['Content Creation', 'Student Analytics', 'Task Assignment', 'Progress Reports'],
      link: '/teacher/dashboard',
      available: isTeacher || !isSignedIn
    },
    {
      title: 'NGO Dashboard',
      description: 'Campaign management and impact tracking',
      icon: Globe,
      color: 'bg-purple-100 text-purple-800',
      features: ['Campaign Management', 'School Connections', 'Impact Tracking', 'Community Reports'],
      link: '/ngo/dashboard',
      available: isNGO || !isSignedIn
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EcoLearning Platform Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore all the features and capabilities of our environmental education platform
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                ← Back to Home
              </button>
            </Link>
            {!isSignedIn && (
              <Link href="/sign-up">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Features Demo */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">{feature.status}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Demo:</strong> {feature.demo}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* User Dashboards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            User Dashboards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userDashboards.map((dashboard, index) => {
              const Icon = dashboard.icon
              return (
                <div key={index} className={`rounded-xl border-2 p-6 ${dashboard.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{dashboard.title}</h3>
                    <p className="text-gray-600 mb-4">{dashboard.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {dashboard.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {dashboard.available ? (
                      <Link href={dashboard.link}>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          {isSignedIn ? 'Access Dashboard' : 'Try Demo'}
                        </button>
                      </Link>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Requires {dashboard.title.split(' ')[0]} role</p>
                        <Link href="/sign-up">
                          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                            Sign Up
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/sign-up">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2" />
                Join Community
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
