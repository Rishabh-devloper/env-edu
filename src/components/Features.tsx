'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { ClipboardCheck, Sprout, Trophy, BookOpen, Target, BarChart3, Award, Globe, Users, Shield, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function Features() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Engage with videos, infographics, and interactive lessons',
      link: '/learning',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn points, unlock badges, and compete on leaderboards',
      link: '/gamification',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Target,
      title: 'Real-World Tasks',
      description: 'Complete environmental challenges and submit proof',
      link: '/tasks',
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor learning progress and performance analytics',
      link: isSignedIn ? (isTeacher ? '/teacher/dashboard' : '/student/dashboard') : '/sign-up',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Rewards System',
      description: 'Earn certificates and badges for achievements',
      link: isSignedIn ? '/student/dashboard' : '/sign-up',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Globe,
      title: 'Community Impact',
      description: 'Connect with schools and track environmental impact',
      link: isSignedIn ? (isNGO ? '/ngo/dashboard' : '/teacher/dashboard') : '/sign-up',
      color: 'bg-teal-100',
      iconColor: 'text-teal-600'
    }
  ]

  const userTypes = [
    {
      icon: GraduationCap,
      title: 'Students',
      description: 'Learn and earn points',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      icon: Users,
      title: 'Teachers',
      description: 'Create and monitor',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      icon: Shield,
      title: 'NGOs',
      description: 'Track impact',
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
            Powerful Features for Environmental Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create engaging, effective environmental learning experiences
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300 cursor-pointer group">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="text-green-600 font-medium group-hover:text-green-700">
                  {isSignedIn ? 'Access Now →' : 'Learn More →'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* User Types */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Designed for Every User
            </h3>
            <p className="text-gray-600">
              Whether you're learning, teaching, or making an impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon
              return (
                <div key={index} className={`rounded-xl border-2 p-6 text-center ${userType.color} hover:shadow-md transition-shadow duration-300`}>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${userType.textColor}`}>{userType.title}</h4>
                  <p className="text-gray-600">{userType.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
