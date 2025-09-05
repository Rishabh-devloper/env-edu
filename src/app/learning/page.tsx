'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { usePoints } from '@/contexts/PointsContext'
import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Filter, 
  Search,
  ChevronRight,
  CheckCircle,
  Lock,
  TrendingUp,
  Target,
  ChevronLeft
} from 'lucide-react'
import LessonCard from '@/components/content/LessonCard'
import QuizComponent from '@/components/content/QuizComponent'
import VideoPlayer from '@/components/content/VideoPlayer'
import { Lesson, Quiz } from '@/types'

export default function LearningPage() {
  const { isSignedIn } = useUser()
  const { isStudent, isTeacher } = useUserRole()
  const { totalPoints, level, addPoints, addBadge } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'lessons' | 'quizzes' | 'progress'>('lessons')
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [userProgress, setUserProgress] = useState({
    totalLessons: 15,
    completedLessons: 8,
    badges: 5
  })

  // Mock data - in production, this would come from API
  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Introduction to Climate Change',
      description: 'Learn the basics of climate change and its impact on our planet',
      content: 'Climate change refers to long-term shifts in global temperatures and weather patterns...',
      type: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 15,
      difficulty: 'beginner',
      ecoPoints: 50,
      prerequisites: [],
      tags: ['climate', 'environment', 'basics'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: 'Recycling Best Practices',
      description: 'Master the art of proper recycling to reduce waste',
      content: 'Recycling is one of the most effective ways to reduce environmental impact...',
      type: 'interactive',
      mediaUrl: 'https://example.com/interactive1.html',
      duration: 20,
      difficulty: 'intermediate',
      ecoPoints: 75,
      prerequisites: ['1'],
      tags: ['recycling', 'waste', 'sustainability'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: '3',
      title: 'Renewable Energy Sources',
      description: 'Explore different types of renewable energy and their benefits',
      content: 'Renewable energy comes from natural sources that are constantly replenished...',
      type: 'infographic',
      mediaUrl: 'https://example.com/infographic1.png',
      duration: 25,
      difficulty: 'advanced',
      ecoPoints: 100,
      prerequisites: ['1', '2'],
      tags: ['energy', 'renewable', 'solar', 'wind'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    },
    {
      id: '4',
      title: 'Water Conservation Techniques',
      description: 'Learn practical ways to conserve water in daily life',
      content: 'Water conservation is essential for sustainable living...',
      type: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 18,
      difficulty: 'beginner',
      ecoPoints: 60,
      prerequisites: [],
      tags: ['water', 'conservation', 'sustainability'],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04')
    },
    {
      id: '5',
      title: 'Biodiversity and Ecosystems',
      description: 'Understand the importance of biodiversity for our planet',
      content: 'Biodiversity is the variety of life on Earth...',
      type: 'interactive',
      mediaUrl: 'https://example.com/interactive2.html',
      duration: 30,
      difficulty: 'intermediate',
      ecoPoints: 85,
      prerequisites: ['1'],
      tags: ['biodiversity', 'ecosystems', 'nature'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    }
  ]

  const quizzes: Quiz[] = [
    {
      id: '1',
      lessonId: '1',
      title: 'Climate Change Basics Quiz',
      questions: [
        {
          id: '1',
          question: 'What is the main cause of climate change?',
          type: 'multiple_choice',
          options: ['Natural cycles', 'Human activities', 'Solar radiation', 'Ocean currents'],
          correctAnswer: 'Human activities',
          explanation: 'Human activities, especially greenhouse gas emissions, are the primary cause of recent climate change.',
          ecoPoints: 10
        },
        {
          id: '2',
          question: 'True or False: Climate change only affects temperature.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Climate change affects many aspects of the climate system, including precipitation, sea levels, and weather patterns.',
          ecoPoints: 10
        }
      ],
      timeLimit: 10,
      passingScore: 70,
      ecoPoints: 50,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      lessonId: '2',
      title: 'Recycling Knowledge Test',
      questions: [
        {
          id: '1',
          question: 'Which of the following can be recycled?',
          type: 'multiple_choice',
          options: ['Plastic bottles', 'Glass jars', 'Aluminum cans', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: 'All of these materials can be recycled when properly sorted and cleaned.',
          ecoPoints: 15
        }
      ],
      timeLimit: 15,
      passingScore: 80,
      ecoPoints: 75,
      createdAt: new Date('2024-01-02')
    }
  ]

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = difficultyFilter === 'all' || lesson.difficulty === difficultyFilter
    const matchesType = typeFilter === 'all' || lesson.type === typeFilter
    
    return matchesSearch && matchesDifficulty && matchesType
  })

  const handleStartLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson) {
      setSelectedLesson(lesson)
    }
  }

  const handleLessonComplete = () => {
    if (selectedLesson) {
      addPoints(selectedLesson.ecoPoints, `Completed lesson: ${selectedLesson.title}`)
      setCompletedLessons(prev => new Set([...prev, selectedLesson.id]))
      setUserProgress(prev => ({
        ...prev,
        completedLessons: prev.completedLessons + 1
      }))
      setSelectedLesson(null)
    }
  }

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
  }

  const handleQuizComplete = (score: number, timeSpent: number) => {
    console.log('Quiz completed:', { score, timeSpent })
    setSelectedQuiz(null)
    if (score >= (selectedQuiz?.passingScore || 70)) {
      addPoints(selectedQuiz?.ecoPoints || 0, `Completed quiz: ${selectedQuiz?.title}`)
    }
  }

  const handleQuizExit = () => {
    setSelectedQuiz(null)
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the learning module.</p>
          <a href="/sign-in" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (selectedQuiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <QuizComponent 
          quiz={selectedQuiz} 
          onComplete={handleQuizComplete}
          onExit={handleQuizExit}
        />
      </div>
    )
  }

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Lesson Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Lessons
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h1>
            <p className="text-gray-600">{selectedLesson.description}</p>
          </div>

          {/* Video Player */}
          {selectedLesson.type === 'video' && (
            <div className="mb-8">
              <VideoPlayer
                src={selectedLesson.mediaUrl || ''}
                title={selectedLesson.title}
                duration={selectedLesson.duration}
                onComplete={handleLessonComplete}
                onProgress={(progress) => {
                  // Track progress if needed
                  console.log('Video progress:', progress)
                }}
              />
            </div>
          )}

          {/* Lesson Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
            </div>
            
            {/* Lesson Meta */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedLesson.duration} min
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {selectedLesson.ecoPoints} points
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {selectedLesson.difficulty}
                  </span>
                </div>
                
                <button
                  onClick={handleLessonComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interactive Learning</h1>
                <p className="text-gray-600">Master environmental sustainability through engaging content</p>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress.completedLessons}/{userProgress.totalLessons}</div>
                <div className="text-sm text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Level {level}</div>
                <div className="text-sm text-gray-500">Level</div>
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
                { id: 'lessons', label: 'Lessons', icon: BookOpen },
                { id: 'quizzes', label: 'Quizzes', icon: Target },
                { id: 'progress', label: 'Progress', icon: TrendingUp }
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

        {/* Lessons Tab */}
        {selectedTab === 'lessons' && (
          <div>
            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search lessons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="interactive">Interactive</option>
                  <option value="infographic">Infographic</option>
                </select>
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={handleStartLesson}
                  isCompleted={completedLessons.has(lesson.id)}
                  progress={completedLessons.has(lesson.id) ? 100 : 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {selectedTab === 'quizzes' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.questions.length} questions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.timeLimit} min
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {quiz.ecoPoints} points
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {selectedTab === 'progress' && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{totalPoints}</div>
                  <div className="text-sm text-gray-500">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Level {level}</div>
                  <div className="text-sm text-gray-500">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.badges}</div>
                  <div className="text-sm text-gray-500">Badges Earned</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {completedLessons.size > 0 ? (
                  Array.from(completedLessons).map((lessonId, index) => {
                    const lesson = lessons.find(l => l.id === lessonId)
                    return lesson ? (
                      <div key={lessonId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <div>
                            <p className="text-gray-700 font-medium">{lesson.title}</p>
                            <p className="text-sm text-gray-500">Completed {index + 1} day ago</p>
                          </div>
                        </div>
                        <div className="text-sm text-green-600 font-medium">+{lesson.ecoPoints} points</div>
                      </div>
                    ) : null
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">No completed lessons yet. Start learning!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
