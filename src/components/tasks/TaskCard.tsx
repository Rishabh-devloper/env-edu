'use client'

import { Task, TaskSubmission } from '@/types'
import { Calendar, Upload, CheckCircle, Clock, AlertCircle, Award, Camera, Video, FileText } from 'lucide-react'
import { useState } from 'react'

interface TaskCardProps {
  task: Task
  userSubmission?: TaskSubmission
  onUpload: (taskId: string, file: File, description: string) => void
  onViewSubmission?: (submission: TaskSubmission) => void
  isTeacher?: boolean
}

export default function TaskCard({ 
  task, 
  userSubmission, 
  onUpload, 
  onViewSubmission,
  isTeacher = false 
}: TaskCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDescription, setUploadDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'expired':
        return <AlertCircle className="w-4 h-4" />
      case 'active':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProofTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Camera className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <Upload className="w-4 h-4" />
    }
  }

  const isExpired = new Date(task.deadline) < new Date()
  const isCompleted = userSubmission?.status === 'approved'
  const isPending = userSubmission?.status === 'pending'

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadDescription.trim()) return

    setIsUploading(true)
    try {
      await onUpload(task.id, selectedFile, uploadDescription)
      setSelectedFile(null)
      setUploadDescription('')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
      isCompleted ? 'border-green-300' : isExpired ? 'border-red-200' : 'border-gray-200'
    }`}>
      {/* Task Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-3">{task.description}</p>
            
            {/* Task Instructions */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <p className="text-sm text-gray-700">{task.instructions}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            isCompleted ? 'completed' : isExpired ? 'expired' : task.status
          )}`}>
            {getStatusIcon(isCompleted ? 'completed' : isExpired ? 'expired' : task.status)}
            <span className="ml-1">
              {isCompleted ? 'Completed' : isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
        </div>

        {/* Task Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Due: {new Date(task.deadline).toLocaleDateString()}
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <Award className="w-4 h-4 mr-1" />
              {task.ecoPoints} points
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              {getProofTypeIcon(task.proofType)}
              <span className="ml-1 capitalize">{task.proofType}</span>
            </div>
          </div>
        </div>

        {/* Submission Status */}
        {userSubmission && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Upload className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Submission {userSubmission.status === 'approved' ? 'Approved' : 
                             userSubmission.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                </span>
              </div>
              <span className="text-xs text-blue-600">
                {new Date(userSubmission.submittedAt).toLocaleDateString()}
              </span>
            </div>
            {userSubmission.feedback && (
              <p className="text-sm text-gray-700 mt-2">{userSubmission.feedback}</p>
            )}
          </div>
        )}

        {/* Upload Section (for students) */}
        {!isTeacher && !isCompleted && !isExpired && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Submit Proof:</h4>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="block">
                <input
                  type="file"
                  accept={task.proofType === 'photo' ? 'image/*' : 
                         task.proofType === 'video' ? 'video/*' : 
                         'application/pdf,.doc,.docx'}
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </label>
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Describe what you did for this task..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Submit Task'}
            </button>
          </div>
        )}

        {/* Teacher Actions */}
        {isTeacher && userSubmission && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {userSubmission.studentId} submitted proof
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(userSubmission.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onViewSubmission?.(userSubmission)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm font-medium transition-colors"
              >
                Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
