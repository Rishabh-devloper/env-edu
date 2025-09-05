'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { usePoints } from '@/contexts/PointsContext'
import { useState } from 'react'
import { 
  Target, 
  Upload, 
  Clock, 
  Award, 
  Filter, 
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar,
  Camera,
  Video,
  FileText
} from 'lucide-react'
import TaskCard from '@/components/tasks/TaskCard'
import { Task, TaskSubmission } from '@/types'

export default function TasksPage() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher, isNGO } = useUserRole()
  const { totalPoints, addPoints } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'my-tasks' | 'all-tasks' | 'create-task'>('my-tasks')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Mock data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Plant a Tree',
      description: 'Plant a tree in your community and document the process',
      instructions: '1. Choose a suitable location for planting\n2. Dig a hole twice the size of the root ball\n3. Place the tree and fill with soil\n4. Water thoroughly\n5. Take a photo of the planted tree',
      ecoPoints: 100,
      deadline: new Date('2024-12-31'),
      proofType: 'photo',
      assignedBy: 'teacher-1',
      assignedTo: ['student-1', 'student-2', 'student-3'],
      submissions: [],
      status: 'active',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: 'Recycling Challenge',
      description: 'Collect and properly sort recyclable materials for one week',
      instructions: '1. Set up separate bins for different materials\n2. Collect recyclables for 7 days\n3. Take photos of your sorted materials\n4. Document the total weight collected',
      ecoPoints: 75,
      deadline: new Date('2024-12-31'),
      proofType: 'photo',
      assignedBy: 'teacher-1',
      assignedTo: ['student-1', 'student-2'],
      submissions: [],
      status: 'active',
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      title: 'Water Conservation Video',
      description: 'Create a video showing water conservation techniques',
      instructions: '1. Choose 3 water conservation methods\n2. Demonstrate each method in your video\n3. Explain why each method is important\n4. Keep video under 3 minutes',
      ecoPoints: 120,
      deadline: new Date('2024-12-31'),
      proofType: 'video',
      assignedBy: 'teacher-1',
      assignedTo: ['student-1'],
      submissions: [],
      status: 'active',
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      title: 'Community Cleanup',
      description: 'Organize a community cleanup event',
      instructions: '1. Find a local area that needs cleaning\n2. Gather friends and family\n3. Clean up the area\n4. Document the before and after\n5. Write a reflection on the experience',
      ecoPoints: 150,
      deadline: new Date('2024-12-31'),
      proofType: 'document',
      assignedBy: 'ngo-1',
      assignedTo: ['student-1', 'student-2', 'student-3'],
      submissions: [],
      status: 'active',
      createdAt: new Date('2024-01-04')
    }
  ]

  const userSubmissions: TaskSubmission[] = [
    {
      id: '1',
      taskId: '1',
      studentId: 'student-1',
      proofUrl: 'https://example.com/tree-planting.jpg',
      description: 'Planted an oak tree in the local park',
      status: 'approved',
      feedback: 'Great work! The tree looks healthy and well-planted.',
      submittedAt: new Date('2024-01-15'),
      reviewedAt: new Date('2024-01-16')
    },
    {
      id: '2',
      taskId: '2',
      studentId: 'student-1',
      proofUrl: 'https://example.com/recycling.jpg',
      description: 'Collected 15kg of recyclables over 7 days',
      status: 'pending',
      submittedAt: new Date('2024-01-20')
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesType = typeFilter === 'all' || task.proofType === typeFilter
    return matchesStatus && matchesType
  })

  const handleTaskUpload = (taskId: string, file: File, description: string) => {
    console.log('Uploading task:', { taskId, file, description })
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      addPoints(task.ecoPoints, `Completed task: ${task.title}`)
    }
    // In a real app, this would upload the file and create a submission
  }

  const handleViewSubmission = (submission: TaskSubmission) => {
    console.log('Viewing submission:', submission)
    // In a real app, this would open a modal or navigate to submission details
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the tasks module.</p>
          <a href="/sign-in" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Environmental Tasks</h1>
                <p className="text-gray-600">Complete real-world environmental challenges</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-500">Active Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                <div className="text-sm text-gray-500">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'my-tasks', label: 'My Tasks', icon: Target },
                { id: 'all-tasks', label: 'All Tasks', icon: Target },
                ...(isTeacher || isNGO ? [{ id: 'create-task', label: 'Create Task', icon: Plus }] : [])
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* My Tasks Tab */}
        {selectedTab === 'my-tasks' && (
          <div>
            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Types</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => {
                const userSubmission = userSubmissions.find(sub => sub.taskId === task.id)
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    userSubmission={userSubmission}
                    onUpload={handleTaskUpload}
                    onViewSubmission={handleViewSubmission}
                    isTeacher={isTeacher}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* All Tasks Tab */}
        {selectedTab === 'all-tasks' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpload={handleTaskUpload}
                  onViewSubmission={handleViewSubmission}
                  isTeacher={isTeacher}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Task Tab (Teachers/NGOs only) */}
        {selectedTab === 'create-task' && (isTeacher || isNGO) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Task</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Describe the task"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Provide detailed instructions"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eco Points</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proof Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
