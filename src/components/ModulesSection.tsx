'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  BarChart3, 
  Award, 
  Users, 
  Globe, 
  GraduationCap,
  Play,
  Upload,
  TrendingUp,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function ModulesSection() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  const modules = [
    {
      id: 'content',
      title: 'Interactive Learning',
      description: 'Engage with videos, infographics, and interactive lessons',
      icon: BookOpen,
      color: 'bg-blue-500',
      features: ['Video Lessons', 'Interactive Content', 'Progress Tracking', 'Adaptive Learning'],
      link: '/learning',
      buttonText: 'Start Learning'
    },
    {
      id: 'gamification',
      title: 'Gamification System',
      description: 'Earn points, unlock badges, and compete on leaderboards',
      icon: Trophy,
      color: 'bg-yellow-500',
      features: ['Eco-Points System', 'Achievement Badges', 'Leaderboards', 'Level Progression'],
      link: '/gamification',
      buttonText: 'View Progress'
    },
    {
      id: 'tasks',
      title: 'Real-World Tasks',
      description: 'Complete environmental challenges and submit proof',
      icon: Target,
      color: 'bg-green-500',
      features: ['Environmental Tasks', 'Proof Upload', 'Teacher Review', 'Deadline Management'],
      link: '/tasks',
      buttonText: 'View Tasks'
    },
    {
      id: 'tracking',
      title: 'Progress Tracking',
      description: 'Monitor learning progress and performance analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
      features: ['Student Analytics', 'Class Reports', 'Performance Metrics', 'Activity Monitoring'],
      link: isSignedIn ? (isTeacher ? '/teacher/dashboard' : '/student/dashboard') : '/sign-up',
      buttonText: isSignedIn ? 'View Analytics' : 'Learn More'
    },
    {
      id: 'rewards',
      title: 'Reward System',
      description: 'Earn certificates and badges for your achievements',
      icon: Award,
      color: 'bg-orange-500',
      features: ['Digital Certificates', 'Achievement Badges', 'Progress Recognition', 'Milestone Rewards'],
      link: isSignedIn ? '/student/dashboard' : '/sign-up',
      buttonText: isSignedIn ? 'View Rewards' : 'Earn Rewards'
    },
    {
      id: 'community',
      title: 'Community Impact',
      description: 'Connect with schools and track environmental impact',
      icon: Globe,
      color: 'bg-teal-500',
      features: ['School Connections', 'Impact Tracking', 'Campaign Management', 'Community Reports'],
      link: isSignedIn ? (isNGO ? '/ngo/dashboard' : '/teacher/dashboard') : '/sign-up',
      buttonText: isSignedIn ? 'View Impact' : 'Join Community'
    }
  ]

  const userTypes = [
    {
      title: 'Students',
      icon: GraduationCap,
      description: 'Learn, earn points, and make a difference',
      features: ['Interactive Lessons', 'Gamified Learning', 'Real-world Tasks', 'Achievement Badges'],
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      title: 'Teachers',
      icon: Users,
      description: 'Create content and monitor student progress',
      features: ['Content Creation', 'Student Monitoring', 'Task Assignment', 'Progress Analytics'],
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      title: 'NGOs',
      icon: Shield,
      description: 'Launch campaigns and track community impact',
      features: ['Campaign Management', 'School Connections', 'Impact Tracking', 'Community Reports'],
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete EcoLearning Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for environmental education in one comprehensive platform
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <div key={module.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  {/* Module Icon */}
                  <div className={`w-16 h-16 ${module.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Module Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                  <p className="text-gray-600 mb-6">{module.description}</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Link href={module.link}>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                      {module.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* User Types Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Designed for Everyone
            </h3>
            <p className="text-lg text-gray-600">
              Whether you're a student, teacher, or NGO member, EcoLearning has something for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon
              return (
                <div key={index} className={`rounded-xl border-2 p-6 ${userType.color} hover:shadow-lg transition-shadow duration-300`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h4 className={`text-xl font-bold mb-2 ${userType.textColor}`}>{userType.title}</h4>
                    <p className="text-gray-600 mb-4">{userType.description}</p>
                    
                    <ul className="space-y-2 text-sm">
                      {userType.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Access Buttons */}
        {isSignedIn && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Access</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {isStudent && (
                <>
                  <Link href="/student/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      My Dashboard
                    </button>
                  </Link>
                  <Link href="/student/dashboard">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      View Progress
                    </button>
                  </Link>
                </>
              )}
              {isTeacher && (
                <>
                  <Link href="/teacher/dashboard">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Teacher Dashboard
                    </button>
                  </Link>
                  <Link href="/teacher/dashboard">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Monitor Students
                    </button>
                  </Link>
                </>
              )}
              {isNGO && (
                <>
                  <Link href="/ngo/dashboard">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      NGO Dashboard
                    </button>
                  </Link>
                  <Link href="/ngo/dashboard">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Track Impact
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
