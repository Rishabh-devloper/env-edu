'use client'

import { User } from '@/types'
import { TrendingUp, TrendingDown, Award, BookOpen, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface StudentProgressCardProps {
  student: User
  stats: {
    lessonsCompleted: number
    totalLessons: number
    tasksCompleted: number
    totalTasks: number
    recentActivity: number
    weeklyProgress: number
  }
  onViewDetails: (studentId: string) => void
}

export default function StudentProgressCard({ student, stats, onViewDetails }: StudentProgressCardProps) {
  const lessonProgress = (stats.lessonsCompleted / stats.totalLessons) * 100
  const taskProgress = (stats.tasksCompleted / stats.totalTasks) * 100
  const overallProgress = (lessonProgress + taskProgress) / 2

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressIcon = (progress: number) => {
    if (progress >= 80) return <TrendingUp className="w-4 h-4" />
    if (progress >= 60) return <Clock className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getStatusIcon = (progress: number) => {
    if (progress >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (progress >= 60) return <Clock className="w-5 h-5 text-yellow-500" />
    return <AlertCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Student Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-lg">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-600">Level {student.level} • {student.ecoPoints} points</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon(overallProgress)}
            <span className={`text-sm font-medium ${getProgressColor(overallProgress)}`}>
              {overallProgress >= 80 ? 'Excellent' : overallProgress >= 60 ? 'Good' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Lessons Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Lessons</span>
              </div>
              <span className="text-sm text-gray-500">
                {stats.lessonsCompleted}/{stats.totalLessons}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${lessonProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(lessonProgress)}% complete</p>
          </div>

          {/* Tasks Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-gray-600">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Tasks</span>
              </div>
              <span className="text-sm text-gray-500">
                {stats.tasksCompleted}/{stats.totalTasks}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(taskProgress)}% complete</p>
          </div>
        </div>

        {/* Recent Activity & Weekly Progress */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Recent Activity</span>
              {getProgressIcon(stats.recentActivity)}
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.recentActivity}</p>
            <p className="text-xs text-gray-500">actions this week</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
              {stats.weeklyProgress > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className={`text-lg font-bold ${stats.weeklyProgress > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.weeklyProgress > 0 ? '+' : ''}{stats.weeklyProgress}%
            </p>
            <p className="text-xs text-gray-500">vs last week</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Badges</h4>
          <div className="flex space-x-2">
            {student.badges.slice(0, 3).map((badge, index) => (
              <div key={index} className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">
                <Award className="w-3 h-3 mr-1" />
                {badge.name}
              </div>
            ))}
            {student.badges.length > 3 && (
              <div className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{student.badges.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(student.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          View Detailed Progress
        </button>
      </div>
    </div>
  )
}
