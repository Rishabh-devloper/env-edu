'use client'

import React from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Shield,
  ArrowRight,
  Users,
  Target,
  BarChart3
} from 'lucide-react'

const roles = [
  {
    id: 'student',
    title: 'Students',
    description: 'Learn environmental sustainability through interactive lessons and earn eco-points',
    icon: GraduationCap,
    color: 'blue',
    stats: '1,856 Active Learners',
    features: ['Interactive Lessons', 'Eco-Points & Badges', 'Real-world Tasks']
  },
  {
    id: 'teacher',
    title: 'Teachers',
    description: 'Create engaging content and monitor student progress in sustainability education',
    icon: BookOpen,
    color: 'green',
    stats: '245 Educators',
    features: ['Content Creation', 'Progress Monitoring', 'Assessment Tools']
  },
  {
    id: 'ngo',
    title: 'NGO Members',
    description: 'Launch environmental campaigns and connect with schools for greater impact',
    icon: Globe,
    color: 'purple',
    stats: '35 Organizations',
    features: ['Campaign Management', 'School Partnerships', 'Impact Tracking']
  },
  {
    id: 'admin',
    title: 'Administrators',
    description: 'Manage the entire platform and oversee environmental education initiatives',
    icon: Shield,
    color: 'orange',
    stats: '9 Platform Managers',
    features: ['User Management', 'Analytics Dashboard', 'System Control']
  }
]

const RoleShowcase: React.FC = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        title: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Every Stakeholder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform connects students, teachers, NGOs, and administrators in a unified ecosystem 
            for environmental education and impact tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => {
            const colorClasses = getColorClasses(role.color)
            const IconComponent = role.icon

            return (
              <div 
                key={role.id}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  ${colorClasses.bg} ${colorClasses.border}
                `}
              >
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                    <IconComponent className={`w-8 h-8 ${colorClasses.icon}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold ${colorClasses.title} mb-2`}>
                    {role.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {role.description}
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-4 font-medium">
                    {role.stats}
                  </div>
                  
                  <ul className="text-xs text-gray-600 space-y-1 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-center">
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${colorClasses.icon.replace('text-', 'bg-')}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href="/sign-up"
                    className={`
                      inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-white text-sm font-medium
                      transition-colors duration-200 ${colorClasses.button}
                    `}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Platform Stats */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Growing Impact Across India
            </h3>
            <p className="text-gray-600">
              Join thousands of educators, students, and organizations making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,145</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">48</div>
              <div className="text-sm text-gray-600">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <div className="text-sm text-gray-600">Learning Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1,250</div>
              <div className="text-sm text-gray-600">Trees Planted</div>
            </div>
          </div>
        </div>

        {/* Demo Account CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready for the Smart India Hackathon Demo?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Experience our complete role-based ecosystem. Create accounts for different roles and see how 
            students, teachers, NGOs, and admins collaborate for environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-up"
              className="px-8 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Create Demo Account
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoleShowcase
