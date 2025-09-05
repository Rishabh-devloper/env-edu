'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserRole } from '@/types'
import { GraduationCap, Users, Globe, Shield } from 'lucide-react'

interface RoleSelectionProps {
  onRoleSelected: (role: UserRole) => void
}

export default function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const { user } = useUser()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const roles = [
    {
      id: 'student' as UserRole,
      name: 'Student',
      description: 'Learn about environmental sustainability through interactive lessons and earn eco-points',
      icon: GraduationCap,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'teacher' as UserRole,
      name: 'Teacher',
      description: 'Create lessons, assign tasks, and monitor your students\' eco-learning progress',
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'ngo' as UserRole,
      name: 'NGO Member',
      description: 'Connect with schools, launch environmental campaigns, and track community impact',
      icon: Globe,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            Welcome to EcoLearning, {user?.firstName}! 🌱
          </h1>
          <p className="text-lg text-gray-600">
            Please select your role to get started with your personalized eco-learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? `${role.borderColor} ${role.bgColor} ring-2 ring-offset-2 ${role.color.replace('bg-', 'ring-')}`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 ${role.bgColor} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${role.textColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isSelected ? role.textColor : 'text-gray-800'}`}>
                    {role.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 ${role.color} rounded-full flex items-center justify-center`}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-200 ${
              selectedRole
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.name : '...'}
          </button>
        </div>
      </div>
    </div>
  )
}
