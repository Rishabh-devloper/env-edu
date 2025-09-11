'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { useEnhancedTasks } from '@/hooks/useEnhancedData'
import { Task } from '@/types'
import {
  Target, 
  Camera, 
  Upload, 
  Clock, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Trophy, 
  Filter,
  Search,
  Image as ImageIcon,
  FileText,
  Calendar,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function TasksPage() {
  const { user } = useUser()
  const { role, isStudent } = useUserRole()
  const { 
    tasks,
    userSubmissions,
    loading,
    error,
    submitTask,
    refreshData
  } = useEnhancedTasks({
    enablePolling: true,
    pollingInterval: 60000 // Poll every minute for task updates
  })
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [submissionModal, setSubmissionModal] = useState<{isOpen: boolean, task: Task | null}>({isOpen: false, task: null})
  const [submissionData, setSubmissionData] = useState<{images: File[], text: string, description: string}>({images: [], text: '', description: ''})
  const [submitting, setSubmitting] = useState(false)

  // Enhanced task status calculation
  const getTaskStatus = (task: Task) => {
    const submission = userSubmissions.find(sub => sub.taskId === task.id)
    if (!submission) return 'available'
    
    switch (submission.status) {
      case 'pending': return 'under-review'
      case 'approved': return 'completed'
      case 'rejected': return 'available' // Can resubmit
      default: return 'available'
    }
  }
  
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesDifficulty && matchesSearch
  }).map(task => ({ ...task, status: getTaskStatus(task) }))

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'under-review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSubmissionData(prev => ({...prev, images: [...prev.images, ...files]}))
  }

  const removeImage = (index: number) => {
    setSubmissionData(prev => ({
      ...prev, 
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmitTask = async () => {
    if (!submissionModal.task) return
    
    setSubmitting(true)
    try {
      // Convert File objects to base64 or URLs for submission
      const photoUrls = submissionData.images.map(file => URL.createObjectURL(file))
      
      const result = await submitTask({
        taskId: submissionModal.task.id,
        description: submissionData.description || submissionData.text,
        photos: photoUrls,
        location: null // Could be enhanced to get user's location
      })
      
      if (result.success) {
        setSubmissionModal({isOpen: false, task: null})
        setSubmissionData({images: [], text: '', description: ''})
        // Refresh data to show updated task status
        refreshData()
        // Show success message
        console.log('Task submitted successfully!')
      } else {
        // Show error message
        console.error('Failed to submit task:', result.error)
      }
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your eco-tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tasks</h2>
          <p className="text-gray-600 mb-6">Unable to load your environmental tasks: {error.message}</p>
          <button 
            onClick={refreshData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                Real-World Eco Tasks
              </h1>
              <p className="text-gray-600 mt-2">
                Complete environmental challenges and make a real impact in your community
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userSubmissions.filter(sub => sub.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {userSubmissions.filter(sub => sub.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userSubmissions.reduce((total, sub) => 
                    sub.status === 'approved' ? total + (sub.pointsEarned || 0) : total, 0
                  )}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Search tasks..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="conservation">Conservation</option>
                <option value="awareness">Awareness</option>
                <option value="recycling">Recycling</option>
                <option value="energy">Energy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300">
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(task.difficulty)}`}></div>
                  <span className="text-sm font-medium text-gray-600 capitalize">{task.difficulty}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>

              {/* Task Meta */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{task.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{task.points} points</span>
                </div>
                <div className="flex items-center space-x-1">
                  {task.submissionType === 'photo' && <Camera className="w-4 h-4" />}
                  {task.submissionType === 'text' && <FileText className="w-4 h-4" />}
                  {task.submissionType === 'both' && <ImageIcon className="w-4 h-4" />}
                  <span className="capitalize">{task.submissionType}</span>
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex space-x-2">
                {task.status === 'available' && (
                  <button
                    onClick={() => setSubmissionModal({isOpen: true, task})}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Start Task
                  </button>
                )}
                {task.status === 'completed' && (
                  <div className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium text-center flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </div>
                )}
                {task.status === 'under-review' && (
                  <div className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg font-medium text-center flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Under Review
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <Link href="/learning">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                Explore Learning Modules
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Task Submission Modal */}
      {submissionModal.isOpen && submissionModal.task && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{submissionModal.task.title}</h2>
              
              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions:</h3>
                <ol className="space-y-2">
                  {submissionModal.task.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Image Upload */}
              {(submissionModal.task.submissionType === 'photo' || submissionModal.task.submissionType === 'both') && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Images:</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload images or drag and drop</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Preview Images */}
                  {submissionData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {submissionData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Text Submission */}
              {(submissionModal.task.submissionType === 'text' || submissionModal.task.submissionType === 'both') && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description:</h3>
                  <textarea
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData(prev => ({...prev, description: e.target.value}))}
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your task completion, findings, or observations..."
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setSubmissionModal({isOpen: false, task: null})}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  disabled={submitting || (submissionData.images.length === 0 && submissionData.description.trim() === '')}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
