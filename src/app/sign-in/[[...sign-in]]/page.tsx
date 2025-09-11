'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Leaf, 
  Sparkles, 
  TreePine, 
  Waves,
  Sun,
  Cloud
} from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Leaves */}
        <div className="absolute top-20 left-10 animate-float">
          <Leaf className="w-8 h-8 text-green-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <TreePine className="w-12 h-12 text-green-400 opacity-40" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-slow">
          <Waves className="w-10 h-10 text-teal-300 opacity-50" />
        </div>
        <div className="absolute top-60 right-40 animate-pulse">
          <Sun className="w-16 h-16 text-yellow-300 opacity-30" />
        </div>
        <div className="absolute bottom-40 right-10 animate-float">
          <Cloud className="w-14 h-14 text-blue-200 opacity-40" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse-delayed"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-12 group">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">EcoLearning</h1>
                <p className="text-green-100 text-sm">Sustainable Future</p>
              </div>
            </Link>

            {/* Welcome Message */}
            <div className="space-y-6">
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                Welcome back to your
                <span className="block text-green-200">
                  sustainability journey! 🌱
                </span>
              </h2>
              
              <p className="text-xl text-green-100 leading-relaxed">
                Continue learning about environmental conservation, complete eco-challenges, 
                and make a positive impact on our planet.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2,145</div>
                  <div className="text-green-200 text-sm">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1,250</div>
                  <div className="text-green-200 text-sm">Trees Planted</div>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="mt-auto mb-8">
              <blockquote className="text-green-100 italic text-lg">
                "The Earth does not belong to us; we belong to the Earth."
              </blockquote>
              <cite className="text-green-200 text-sm">- Chief Seattle</cite>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800 font-medium group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to EcoLearning
            </h3>
            <p className="text-gray-600">
              Enter your credentials to access your environmental learning dashboard
            </p>
          </div>

          {/* Sign In Component */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white/80 backdrop-blur-lg shadow-2xl border border-green-100 rounded-2xl',
                    headerTitle: 'text-2xl font-bold text-green-800',
                    headerSubtitle: 'text-green-600',
                    socialButtonsBlockButton: 'border-green-200 hover:bg-green-50 text-green-700 rounded-xl transition-all duration-200 hover:scale-105',
                    formButtonPrimary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl',
                    formFieldInput: 'border-green-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white/50 backdrop-blur-sm',
                    formFieldLabel: 'text-green-700 font-medium',
                    identityPreviewEditButton: 'text-green-600 hover:text-green-700',
                    footerActionLink: 'text-green-600 hover:text-green-700 font-medium',
                    otpCodeFieldInput: 'border-green-200 focus:border-green-500 focus:ring-green-500',
                    formResendCodeLink: 'text-green-600 hover:text-green-700',
                    alertText: 'text-red-600',
                    formFieldWarningText: 'text-amber-600'
                  },
                  layout: {
                    shimmer: false
                  }
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center lg:text-left">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/sign-up" 
                className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
              >
                Create one now
              </Link>
            </p>
            
            <div className="flex items-center justify-center lg:justify-start space-x-2 mt-4 text-green-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Start your eco-learning journey today!</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
