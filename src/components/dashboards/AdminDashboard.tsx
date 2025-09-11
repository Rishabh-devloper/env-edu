'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  UserCheck,
  FileText,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user } = useUser()

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      count: '1,247 users',
      stats: '24 new this week'
    },
    {
      title: 'System Analytics',
      description: 'View platform metrics and performance',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500',
      count: 'Live metrics',
      stats: '99.9% uptime'
    },
    {
      title: 'Content Moderation',
      description: 'Review and moderate user-generated content',
      icon: Shield,
      href: '/admin/moderation',
      color: 'bg-red-500',
      count: '15 pending',
      stats: '3 flagged items'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and features',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      count: 'Configuration',
      stats: 'Last updated today'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-200 to-slate-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-15 animate-pulse-delayed"></div>
      </div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Welcome, {user?.firstName}! 🛡️
                </h1>
                <p className="text-gray-600 font-medium">
                  System Administrator Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-bold text-green-600">Healthy</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Issues</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Server Load</p>
                  <p className="text-3xl font-bold text-purple-600">23%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Administration Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group"
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-200 group-hover:scale-105">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{feature.count}</span>
                        </div>
                        <p className="text-xs text-gray-500">{feature.stats}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Database Health</h3>
                <p className="text-sm text-gray-600 mb-4">Monitor database performance and integrity</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Check Status
                </button>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">System Logs</h3>
                <p className="text-sm text-gray-600 mb-4">View and analyze system activity logs</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  View Logs
                </button>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Settings</h3>
                <p className="text-sm text-gray-600 mb-4">Configure platform-wide settings and features</p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
