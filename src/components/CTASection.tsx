'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { ArrowRight, CheckCircle, Star, Users, Award, Globe } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()

  const stats = [
    { number: '10,000+', label: 'Students Learning', icon: Users },
    { number: '500+', label: 'Schools Connected', icon: Globe },
    { number: '50,000+', label: 'Eco Points Earned', icon: Award },
    { number: '95%', label: 'Satisfaction Rate', icon: Star }
  ]

  const features = [
    'Interactive Learning Modules',
    'Gamified Progress Tracking',
    'Real-world Environmental Tasks',
    'Teacher Analytics Dashboard',
    'NGO Impact Tracking',
    'Certificate Generation',
    'Badge Achievement System',
    'Community Leaderboards'
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Environmental Education?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of students, teachers, and NGOs already making a difference with EcoLearning
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isSignedIn ? (
              <>
                <Link href="/sign-up">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200">
                    Sign In
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isStudent && (
                  <Link href="/student/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center">
                      Continue Learning
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>
                )}
                {isTeacher && (
                  <Link href="/teacher/dashboard">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center">
                      Teacher Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>
                )}
                {isNGO && (
                  <Link href="/ngo/dashboard">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center">
                      NGO Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h3>
            <p className="text-gray-600">
              Comprehensive features designed for modern environmental education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 mb-6 italic">
              "EcoLearning has transformed how we teach environmental science. Our students are more engaged than ever, and the real-world tasks have made learning truly meaningful."
            </blockquote>
            <div className="text-sm text-gray-600">
              <strong>Sarah Johnson</strong> - Environmental Science Teacher, Green Valley School
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Your Eco-Learning Journey Today
          </h3>
          <p className="text-gray-600 mb-8">
            Join the movement towards a more sustainable future through education
          </p>
          {!isSignedIn && (
            <Link href="/sign-up">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started Now - It's Free!
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
