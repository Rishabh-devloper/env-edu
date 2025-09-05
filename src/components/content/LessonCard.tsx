'use client'

import { Lesson } from '@/types'
import { Play, Clock, Star, Award, BookOpen, Image, Zap } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  onStart: (lessonId: string) => void
  isCompleted?: boolean
  progress?: number
}

export default function LessonCard({ lesson, onStart, isCompleted = false, progress = 0 }: LessonCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />
      case 'infographic':
        return <Image className="w-5 h-5" />
      case 'interactive':
        return <Zap className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Lesson Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              {getTypeIcon(lesson.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
              <p className="text-sm text-gray-600">{lesson.description}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <Award className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Lesson Meta */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {lesson.duration} min
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Star className="w-4 h-4 mr-1" />
            {lesson.ecoPoints} points
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </span>
        </div>

        {/* Progress Bar */}
        {progress > 0 && !isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {lesson.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{lesson.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onStart(lesson.id)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
            isCompleted
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed' : 'Start Lesson'}
        </button>
      </div>
    </div>
  )
}
