'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useRef } from 'react'
import { useEnhancedTasks } from '@/hooks/useEnhancedData'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  ArrowLeft,
  Camera,
  MapPin,
  Clock,
  Star,
  Trophy,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Users,
  Calendar,
  Target,
  Leaf
} from 'lucide-react'

export default function TaskDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const { tasks, userSubmissions, submitTask, loading } = useEnhancedTasks()
  
  const [task, setTask] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [photos, setPhotos] = useState([])
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [locationPermission, setLocationPermission] = useState('prompt')
  const [uploadError, setUploadError] = useState('')
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (tasks.length > 0 && id) {
      const foundTask = tasks.find(t => t.id === id)
      setTask(foundTask)
      
      const foundSubmission = userSubmissions.find(s => s.taskId === id)
      setSubmission(foundSubmission)
    }
  }, [tasks, userSubmissions, id])

  // Request location permission on component mount
  useEffect(() => {
    if (task?.requirements?.locationRequired && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          setLocationPermission('granted')
        },
        (error) => {
          console.error('Location error:', error)
          setLocationPermission('denied')
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [task])

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    if (photos.length + files.length > 5) {
      setUploadError('Maximum 5 photos allowed')
      return
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Each photo must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          dataUrl: e.target.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
    setUploadError('')
  }

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const handleSubmit = async () => {
    if (!task) return

    // Validation
    if (task.requirements?.photoRequired && photos.length === 0) {
      setUploadError('At least one photo is required for this task')
      return
    }

    if (task.requirements?.locationRequired && !currentLocation) {
      setUploadError('Location access is required for this task')
      return
    }

    if (!description.trim()) {
      setUploadError('Please provide a description of your work')
      return
    }

    setSubmitting(true)
    try {
      // In a real app, you'd upload photos to a storage service first
      const photoUrls = photos.map(photo => photo.name)
      
      const result = await submitTask({
        taskId: task.id,
        description: description.trim(),
        photos: photoUrls,
        location: currentLocation
      })

      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/student?view=tasks')
        }, 2000)
      } else {
        setUploadError('Failed to submit task. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setUploadError('An error occurred while submitting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/student')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isCompleted = submission?.status === 'approved'
  const isPending = submission?.status === 'pending'
  const isRejected = submission?.status === 'rejected'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tasks
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Task submitted successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Task Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              task.category === 'tree_planting' ? 'bg-green-100 text-green-600' :
              task.category === 'waste_management' ? 'bg-blue-100 text-blue-600' :
              task.category === 'energy_conservation' ? 'bg-yellow-100 text-yellow-600' :
              'bg-cyan-100 text-cyan-600'
            }`}>
              <span className="text-2xl">
                {task.category === 'tree_planting' ? '🌳' :
                 task.category === 'waste_management' ? '♻️' :
                 task.category === 'energy_conservation' ? '⚡' : '💧'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isCompleted && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Completed
                </span>
              )}
              {isPending && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> Under Review
                </span>
              )}
              {isRejected && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> Needs Revision
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {task.difficulty}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">{task.description}</p>

          {/* Task Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">{task.ecoPoints} XP</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">~{task.estimatedTime}min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-600">{task.category.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Real Impact</span>
            </div>
          </div>

          {/* Requirements */}
          {task.requirements && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="flex flex-wrap gap-3">
                {task.requirements.photoRequired && (
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo Evidence Required
                  </div>
                )}
                {task.requirements.locationRequired && (
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location Verification
                  </div>
                )}
                {task.requirements.verificationType === 'teacher' && (
                  <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Teacher Review
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submission Form or Status */}
        {isCompleted ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Task Completed! 🎉</h2>
              <p className="text-green-700 mb-4">Great work! You've earned {task.ecoPoints} XP for making a real environmental impact.</p>
              {submission?.feedback && (
                <div className="bg-white rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Teacher Feedback:</h4>
                  <p className="text-gray-600">{submission.feedback}</p>
                </div>
              )}
              <button
                onClick={() => router.push('/student?view=tasks')}
                className="mt-6 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                View More Tasks
              </button>
            </div>
          </div>
        ) : isPending ? (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-200">
            <div className="text-center">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-orange-800 mb-2">Under Review 🔍</h2>
              <p className="text-orange-700 mb-4">Your submission has been received and is being reviewed by your teacher.</p>
              <div className="bg-white rounded-xl p-4 mt-4 text-left">
                <h4 className="font-semibold text-gray-800 mb-2">Your Submission:</h4>
                <p className="text-gray-600 mb-2">{submission?.description}</p>
                <p className="text-sm text-gray-500">Submitted on {new Date(submission?.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📤 Submit Your Work</h2>
            
            {/* Location Status */}
            {task.requirements?.locationRequired && (
              <div className="mb-6 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-800">Location Verification</span>
                  </div>
                  {locationPermission === 'granted' ? (
                    <span className="text-green-600 text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> Location Captured
                    </span>
                  ) : (
                    <span className="text-orange-600 text-sm">📍 Location Required</span>
                  )}
                </div>
                {currentLocation ? (
                  <p className="text-sm text-gray-600">
                    Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    (±{Math.round(currentLocation.accuracy)}m accuracy)
                  </p>
                ) : locationPermission === 'denied' ? (
                  <p className="text-sm text-red-600">Location access denied. Please enable location services for this task.</p>
                ) : (
                  <p className="text-sm text-gray-600">Requesting location access...</p>
                )}
              </div>
            )}

            {/* Photo Upload */}
            {task.requirements?.photoRequired && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📸 Photo Evidence (Required)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  {photos.length === 0 ? (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Take or upload photos of your environmental action</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📱 Add Photos
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Max 5 photos, 10MB each</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {photos.map((photo) => (
                          <div key={photo.id} className="relative">
                            <img
                              src={photo.dataUrl}
                              alt={photo.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {photos.length < 5 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          + Add More Photos
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
                📝 Description of Your Work (Required)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you did, where you did it, and any challenges you faced..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Be specific about your environmental action and its impact</p>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {uploadError}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-8 py-3 rounded-xl font-medium transition-all ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  '🚀 Submit Task'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
