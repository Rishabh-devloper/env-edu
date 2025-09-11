'use client'

import React from 'react'
import { UserRole } from '@/types'
import { 
  GraduationCap, 
  Users, 
  Globe, 
  Shield,
  BookOpen,
  Target,
  Award,
  Settings
} from 'lucide-react'

interface RoleSelectorProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  disabled?: boolean
}

const roles = [
  {
    id: 'student' as UserRole,
    title: 'Student',
    description: 'Learn about environmental sustainability, take quizzes, and earn eco-points',
    icon: GraduationCap,
    color: 'blue',
    features: [
      'Access interactive lessons',
      'Take environmental quizzes',
      'Submit eco-action tasks',
      'Earn points and badges',
      'Join leaderboards'
    ]
  },
  {
    id: 'teacher' as UserRole,
    title: 'Teacher',
    description: 'Create educational content and monitor student progress',
    icon: BookOpen,
    color: 'green',
    features: [
      'Create lessons and quizzes',
      'Assign eco-tasks to students',
      'Monitor student progress',
      'Review task submissions',
      'Generate class reports'
    ]
  },
  {
    id: 'ngo' as UserRole,
    title: 'NGO Member',
    description: 'Launch environmental campaigns and track community impact',
    icon: Globe,
    color: 'purple',
    features: [
      'Launch sustainability campaigns',
      'Connect with schools',
      'Track environmental impact',
      'Monitor campaign progress',
      'Generate impact reports'
    ]
  },
  {
    id: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Manage the entire platform and oversee all operations',
    icon: Shield,
    color: 'orange',
    features: [
      'Manage all users and roles',
      'System configuration',
      'Platform analytics',
      'Content moderation',
      'Monitor system health'
    ]
  }
]

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  selectedRole, 
  onRoleSelect, 
  disabled = false 
}) => {
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-blue-200',
        bg: isSelected ? 'bg-blue-50' : 'bg-white',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        ring: 'focus:ring-blue-500'
      },
      green: {
        border: isSelected ? 'border-green-500' : 'border-green-200',
        bg: isSelected ? 'bg-green-50' : 'bg-white',
        icon: 'text-green-600',
        title: 'text-green-800',
        ring: 'focus:ring-green-500'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-purple-200',
        bg: isSelected ? 'bg-purple-50' : 'bg-white',
        icon: 'text-purple-600',
        title: 'text-purple-800',
        ring: 'focus:ring-purple-500'
      },
      orange: {
        border: isSelected ? 'border-orange-500' : 'border-orange-200',
        bg: isSelected ? 'bg-orange-50' : 'bg-white',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        ring: 'focus:ring-orange-500'
      }
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Your Role</h3>
        <p className="text-sm text-gray-600">
          Select the role that best describes your purpose on the EcoLearning platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id
          const colorClasses = getColorClasses(role.color, isSelected)
          const IconComponent = role.icon

          return (
            <button
              key={role.id}
              type="button"
              disabled={disabled}
              onClick={() => onRoleSelect(role.id)}
              className={`
                relative p-6 border-2 rounded-lg text-left transition-all duration-200
                ${colorClasses.border} ${colorClasses.bg} ${colorClasses.ring}
                hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                ${isSelected ? 'ring-2 ring-offset-2' : ''}
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className={`w-4 h-4 rounded-full ${colorClasses.icon.replace('text-', 'bg-')}`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-lg font-bold ${colorClasses.title}`}>
                    {role.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    {role.description}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {role.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${colorClasses.icon.replace('text-', 'bg-')}`} />
                        {feature}
                      </li>
                    ))}
                    {role.features.length > 3 && (
                      <li className="text-gray-400 italic">
                        +{role.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selectedRole && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center text-sm text-gray-700">
            <Award className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Selected: <strong className="text-gray-900">
                {roles.find(r => r.id === selectedRole)?.title}
              </strong>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You can change your role later in your profile settings.
          </p>
        </div>
      )}
    </div>
  )
}

export default RoleSelector
