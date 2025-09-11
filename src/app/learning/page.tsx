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
  Search,
  CheckCircle,
  TrendingUp,
  Target,
  ChevronLeft,
  Leaf,
  Zap,
  Droplets,
  Sun,
  TreePine,
  Sparkles,
  Trophy,
  Flame,
  Globe,
  ArrowRight
} from 'lucide-react'
import QuizComponent from '@/components/content/QuizComponent'
import VideoPlayer from '@/components/content/VideoPlayer'
import { Lesson, Quiz } from '@/types'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'


export default function LearningPage() {
  const { isSignedIn } = useUser()
  const { } = useUserRole()
  const { 
    totalPoints, 
    level, 
    completedLessons, 
    completionRate, 
    streak, 
    nextLevelPoints,
    addPoints, 
    completeLesson,
    isLoading 
  } = usePoints()
  const [selectedTab, setSelectedTab] = useState<'lessons' | 'quizzes' | 'progress'>('lessons')
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [recentAchievement, setRecentAchievement] = useState<string | null>(null)
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; pointsEarned: number } | null>(null)

  // Motion values for animated progress bars
  const completionMotionValue = useMotionValue(0)
  const pointsMotionValue = useMotionValue(0)
  const levelMotionValue = useMotionValue(1)
  
  const animatedCompletion = useSpring(completionMotionValue, { stiffness: 100, damping: 30 })
  const animatedPoints = useSpring(pointsMotionValue, { stiffness: 100, damping: 30 })
  const animatedLevel = useSpring(levelMotionValue, { stiffness: 100, damping: 30 })

  // Transform values for display
  const animatedCompletionText = useTransform(animatedCompletion, (value) => `${Math.round(value)}%`)
  const animatedCompletionWidth = useTransform(animatedCompletion, (value) => `${value}%`)
  const animatedPointsText = useTransform(animatedPoints, (value) => Math.round(value).toString())
  const animatedLevelText = useTransform(animatedLevel, (value) => Math.round(value).toString())

  // Animate progress values when they change
  useEffect(() => {
    completionMotionValue.set(completionRate)
    pointsMotionValue.set(totalPoints)
    levelMotionValue.set(level)
  }, [completionRate, totalPoints, level, completionMotionValue, pointsMotionValue, levelMotionValue])

  // Dynamic lessons state
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonsLoading, setLessonsLoading] = useState<boolean>(true)
  const [lessonsError, setLessonsError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function loadLessons() {
      try {
        setLessonsLoading(true)
        setLessonsError(null)
        const resp = await fetch('/api/lessons?limit=50', { signal: controller.signal })
        if (!resp.ok) throw new Error(`Failed to load lessons: ${resp.status}`)
        const json = await resp.json()
        if (json?.success && Array.isArray(json.data)) {
          setLessons(json.data as Lesson[])
        } else {
          throw new Error('Unexpected lessons response')
        }
      } catch (err) {
        const error = err as unknown as { name?: string; message?: string }
        if (error?.name !== 'AbortError') {
          console.error(error)
          setLessonsError(error?.message || 'Error loading lessons')
        }
      } finally {
        setLessonsLoading(false)
      }
    }
    loadLessons()
    return () => controller.abort()
  }, [])

  const quizzes: Quiz[] = [
    {
      id: '1',
      lessonId: '1',
      title: 'Climate Change Fundamentals',
      questions: [
        {
          id: '1',
          question: 'What is the main cause of recent climate change?',
          type: 'multiple_choice',
          options: ['Natural solar cycles', 'Human activities', 'Volcanic eruptions', 'Ocean currents'],
          correctAnswer: 'Human activities',
          explanation: 'Human activities, especially burning fossil fuels and deforestation, are the primary drivers of recent climate change.',
          ecoPoints: 10
        },
        {
          id: '2',
          question: 'True or False: Climate change only affects global temperatures.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Climate change affects precipitation patterns, sea levels, extreme weather events, and entire ecosystems.',
          ecoPoints: 10
        },
        {
          id: '3',
          question: 'Which greenhouse gas contributes most to global warming?',
          type: 'multiple_choice',
          options: ['Methane', 'Carbon dioxide', 'Nitrous oxide', 'Fluorinated gases'],
          correctAnswer: 'Carbon dioxide',
          explanation: 'CO2 makes up about 76% of total greenhouse gas emissions and has the largest impact on global warming.',
          ecoPoints: 10
        },
        {
          id: '4',
          question: 'What causes sea level rise?',
          type: 'multiple_choice',
          options: ['Only melting glaciers', 'Only thermal expansion', 'Both thermal expansion and ice melt', 'Increased rainfall'],
          correctAnswer: 'Both thermal expansion and ice melt',
          explanation: 'Sea level rise is caused by both thermal expansion of warming seawater and melting of land-based ice.',
          ecoPoints: 10
        },
        {
          id: '5',
          question: 'Which of these is NOT a renewable energy source?',
          type: 'multiple_choice',
          options: ['Solar power', 'Wind energy', 'Natural gas', 'Hydroelectric'],
          correctAnswer: 'Natural gas',
          explanation: 'Natural gas is a fossil fuel and therefore not renewable, unlike solar, wind, and hydroelectric power.',
          ecoPoints: 10
        },
        {
          id: '6',
          question: 'The Paris Agreement aims to limit global warming to how much above pre-industrial levels?',
          type: 'multiple_choice',
          options: ['1.0°C', '1.5°C', '2.0°C', '2.5°C'],
          correctAnswer: '1.5°C',
          explanation: 'The Paris Agreement aims to limit global warming to well below 2°C, preferably to 1.5°C above pre-industrial levels.',
          ecoPoints: 10
        },
        {
          id: '7',
          question: 'True or False: Electric vehicles produce zero emissions.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'While EVs produce no direct emissions, they may have indirect emissions from electricity generation and manufacturing.',
          ecoPoints: 10
        },
        {
          id: '8',
          question: 'Which sector produces the most greenhouse gas emissions globally?',
          type: 'multiple_choice',
          options: ['Transportation', 'Agriculture', 'Energy production', 'Buildings'],
          correctAnswer: 'Energy production',
          explanation: 'Energy production (electricity and heat) accounts for about 25% of global greenhouse gas emissions.',
          ecoPoints: 10
        },
        {
          id: '9',
          question: 'Deforestation contributes to climate change by:',
          type: 'multiple_choice',
          options: ['Releasing stored carbon', 'Reducing CO2 absorption', 'Changing local weather patterns', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: 'Deforestation releases stored carbon, reduces CO2 absorption capacity, and alters local weather patterns.',
          ecoPoints: 10
        },
        {
          id: '10',
          question: 'True or False: Small islands are particularly vulnerable to climate change.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Small island states face existential threats from sea level rise, coastal erosion, and saltwater intrusion.',
          ecoPoints: 10
        }
      ],
      timeLimit: 15,
      passingScore: 70,
      ecoPoints: 100,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      lessonId: '2',
      title: 'Recycling & Waste Management Mastery',
      questions: [
        {
          id: '1',
          question: 'Which of the following materials has the highest recycling rate?',
          type: 'multiple_choice',
          options: ['Plastic bottles', 'Aluminum cans', 'Glass bottles', 'Paper'],
          correctAnswer: 'Aluminum cans',
          explanation: 'Aluminum cans have one of the highest recycling rates at around 70-80% globally.',
          ecoPoints: 10
        },
        {
          id: '2',
          question: 'What does the number inside the recycling symbol on plastic containers indicate?',
          type: 'multiple_choice',
          options: ['Quality grade', 'Manufacturing date', 'Resin identification code', 'Recycling difficulty'],
          correctAnswer: 'Resin identification code',
          explanation: 'The number indicates the type of plastic resin used, helping determine recyclability.',
          ecoPoints: 10
        },
        {
          id: '3',
          question: 'True or False: All plastics marked with a recycling symbol can be recycled curbside.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Not all numbered plastics are accepted in curbside programs. Check local guidelines.',
          ecoPoints: 10
        },
        {
          id: '4',
          question: 'What is the correct order of the waste hierarchy?',
          type: 'multiple_choice',
          options: ['Recycle, Reduce, Reuse', 'Reduce, Reuse, Recycle', 'Reuse, Reduce, Recycle', 'Recycle, Reuse, Reduce'],
          correctAnswer: 'Reduce, Reuse, Recycle',
          explanation: 'The 3 Rs are prioritized: Reduce consumption first, then Reuse items, and finally Recycle materials.',
          ecoPoints: 10
        },
        {
          id: '5',
          question: 'Which item should NOT go in your recycling bin?',
          type: 'multiple_choice',
          options: ['Clean pizza box', 'Greasy pizza box', 'Newspaper', 'Empty glass jar'],
          correctAnswer: 'Greasy pizza box',
          explanation: 'Greasy or food-soiled cardboard cannot be recycled as the oils contaminate the recycling process.',
          ecoPoints: 10
        },
        {
          id: '6',
          question: 'What percentage of a recycled aluminum can becomes a new can?',
          type: 'multiple_choice',
          options: ['50%', '75%', '95%', '100%'],
          correctAnswer: '100%',
          explanation: 'Aluminum can be recycled infinitely without quality loss - 100% becomes new aluminum products.',
          ecoPoints: 10
        },
        {
          id: '7',
          question: 'True or False: Composting is a form of recycling.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Composting is biological recycling - organic matter is broken down and transformed into useful compost.',
          ecoPoints: 10
        },
        {
          id: '8',
          question: 'What is "wishcycling"?',
          type: 'multiple_choice',
          options: ['Hoping items will be recycled', 'Putting non-recyclables in recycling bins', 'Wishing for better recycling programs', 'All of the above'],
          correctAnswer: 'Putting non-recyclables in recycling bins',
          explanation: 'Wishcycling is putting items in recycling bins hoping they\'ll be recycled, even when they\'re not recyclable.',
          ecoPoints: 10
        },
        {
          id: '9',
          question: 'How many times can paper typically be recycled?',
          type: 'multiple_choice',
          options: ['3-5 times', '5-7 times', '7-10 times', 'Infinite times'],
          correctAnswer: '5-7 times',
          explanation: 'Paper fibers become shorter each time they\'re recycled, limiting recycling to about 5-7 cycles.',
          ecoPoints: 10
        },
        {
          id: '10',
          question: 'True or False: Recycling one ton of paper saves 17 trees.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Recycling one ton of paper saves approximately 17 trees, along with water and energy.',
          ecoPoints: 10
        }
      ],
      timeLimit: 20,
      passingScore: 80,
      ecoPoints: 120,
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      lessonId: '3',
      title: 'Renewable Energy & Sustainability',
      questions: [
        {
          id: '1',
          question: 'Which renewable energy source has the fastest growing capacity worldwide?',
          type: 'multiple_choice',
          options: ['Solar power', 'Wind power', 'Hydroelectric', 'Geothermal'],
          correctAnswer: 'Solar power',
          explanation: 'Solar power has experienced the fastest capacity growth globally in recent years.',
          ecoPoints: 10
        },
        {
          id: '2',
          question: 'True or False: Geothermal energy can only be used in areas with hot springs.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Ground-source heat pumps can utilize geothermal energy almost anywhere by accessing stable ground temperatures.',
          ecoPoints: 10
        },
        {
          id: '3',
          question: 'What is the main advantage of wind energy?',
          type: 'multiple_choice',
          options: ['Low maintenance costs', 'No fuel costs', 'Easy installation', 'Silent operation'],
          correctAnswer: 'No fuel costs',
          explanation: 'Wind energy\'s main advantage is that wind is free, resulting in very low operating costs.',
          ecoPoints: 10
        },
        {
          id: '4',
          question: 'Which country leads the world in solar energy capacity?',
          type: 'multiple_choice',
          options: ['United States', 'Germany', 'China', 'Japan'],
          correctAnswer: 'China',
          explanation: 'China has the world\'s largest solar energy capacity, far exceeding other countries.',
          ecoPoints: 10
        },
        {
          id: '5',
          question: 'True or False: Hydroelectric dams have no environmental impact.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'While renewable, large dams can affect river ecosystems, fish migration, and local communities.',
          ecoPoints: 10
        },
        {
          id: '6',
          question: 'What is biomass energy?',
          type: 'multiple_choice',
          options: ['Energy from radioactive materials', 'Energy from organic materials', 'Energy from minerals', 'Energy from synthetic fuels'],
          correctAnswer: 'Energy from organic materials',
          explanation: 'Biomass energy comes from organic materials like wood, crops, and waste that can be burned or converted to fuel.',
          ecoPoints: 10
        },
        {
          id: '7',
          question: 'Which factor most affects solar panel efficiency?',
          type: 'multiple_choice',
          options: ['Panel color', 'Weather conditions', 'Panel angle and orientation', 'Installation height'],
          correctAnswer: 'Panel angle and orientation',
          explanation: 'Proper angle and orientation toward the sun maximizes solar panel energy production.',
          ecoPoints: 10
        },
        {
          id: '8',
          question: 'True or False: Tidal energy is a form of renewable energy.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Tidal energy harnesses the natural rise and fall of ocean tides, making it a renewable energy source.',
          ecoPoints: 10
        },
        {
          id: '9',
          question: 'What is the biggest challenge for renewable energy adoption?',
          type: 'multiple_choice',
          options: ['High initial costs', 'Energy storage', 'Public acceptance', 'Technical complexity'],
          correctAnswer: 'Energy storage',
          explanation: 'Storing renewable energy for use when sun isn\'t shining or wind isn\'t blowing remains a major challenge.',
          ecoPoints: 10
        },
        {
          id: '10',
          question: 'True or False: Nuclear energy is considered renewable.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Nuclear energy uses finite uranium resources and produces radioactive waste, so it\'s not considered renewable.',
          ecoPoints: 10
        }
      ],
      timeLimit: 18,
      passingScore: 75,
      ecoPoints: 110,
      createdAt: '2024-01-03'
    },
    {
      id: '4',
      lessonId: '4',
      title: 'Biodiversity & Conservation Challenge',
      questions: [
        {
          id: '1',
          question: 'What percentage of Earth\'s species are estimated to live in tropical rainforests?',
          type: 'multiple_choice',
          options: ['25%', '50%', '75%', '90%'],
          correctAnswer: '50%',
          explanation: 'Despite covering only 6% of Earth\'s surface, tropical rainforests contain about 50% of all species.',
          ecoPoints: 10
        },
        {
          id: '2',
          question: 'True or False: The current rate of species extinction is 100-1000 times faster than natural rates.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Scientists estimate current extinction rates are 100-1000 times higher than natural background rates.',
          ecoPoints: 10
        },
        {
          id: '3',
          question: 'What is the primary cause of biodiversity loss globally?',
          type: 'multiple_choice',
          options: ['Climate change', 'Habitat destruction', 'Pollution', 'Invasive species'],
          correctAnswer: 'Habitat destruction',
          explanation: 'Habitat destruction, mainly for agriculture and urban development, is the leading cause of biodiversity loss.',
          ecoPoints: 10
        },
        {
          id: '4',
          question: 'Which of these is NOT one of the main threats to marine biodiversity?',
          type: 'multiple_choice',
          options: ['Ocean acidification', 'Overfishing', 'Marine protected areas', 'Plastic pollution'],
          correctAnswer: 'Marine protected areas',
          explanation: 'Marine protected areas help preserve biodiversity; the others are threats to marine ecosystems.',
          ecoPoints: 10
        },
        {
          id: '5',
          question: 'True or False: Keystone species have a disproportionately large impact on their ecosystem.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Keystone species play critical roles in maintaining ecosystem structure and function despite their relatively small numbers.',
          ecoPoints: 10
        },
        {
          id: '6',
          question: 'What does CITES stand for?',
          type: 'multiple_choice',
          options: ['Convention on International Trade in Endangered Species', 'Conservation Initiative for Threatened Ecosystems', 'Center for International Terrestrial Studies', 'Climate Impact on Threatened Species'],
          correctAnswer: 'Convention on International Trade in Endangered Species',
          explanation: 'CITES regulates international trade in endangered species to prevent their exploitation.',
          ecoPoints: 10
        },
        {
          id: '7',
          question: 'Which biome has the highest biodiversity?',
          type: 'multiple_choice',
          options: ['Temperate forests', 'Grasslands', 'Tropical rainforests', 'Coral reefs'],
          correctAnswer: 'Tropical rainforests',
          explanation: 'Tropical rainforests have the highest terrestrial biodiversity, while coral reefs have the highest marine biodiversity.',
          ecoPoints: 10
        },
        {
          id: '8',
          question: 'True or False: Corridors connecting protected areas help wildlife conservation.',
          type: 'true_false',
          correctAnswer: 'True',
          explanation: 'Wildlife corridors allow animals to move between habitats, maintain genetic diversity, and access resources.',
          ecoPoints: 10
        },
        {
          id: '9',
          question: 'What is ecosystem service?',
          type: 'multiple_choice',
          options: ['Services provided to ecosystems', 'Benefits people derive from ecosystems', 'Protection services for endangered species', 'Restoration services for damaged habitats'],
          correctAnswer: 'Benefits people derive from ecosystems',
          explanation: 'Ecosystem services are benefits like clean water, pollination, and climate regulation that ecosystems provide to humans.',
          ecoPoints: 10
        },
        {
          id: '10',
          question: 'True or False: Urban areas cannot support significant biodiversity.',
          type: 'true_false',
          correctAnswer: 'False',
          explanation: 'Well-designed urban areas with green spaces, parks, and green roofs can support considerable biodiversity.',
          ecoPoints: 10
        }
      ],
      timeLimit: 20,
      passingScore: 75,
      ecoPoints: 130,
      createdAt: '2024-01-04'
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

  // Environmental theme icons for different lesson types
  const getThemeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-5 h-5" />
      case 'interactive': return <Zap className="w-5 h-5" />
      case 'infographic': return <Globe className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStartLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson) {
      setSelectedLesson(lesson)
    }
  }

  const handleLessonComplete = async () => {
    if (selectedLesson) {
      if (isCompleting) return
      setIsCompleting(true)
      const oldLevel = level
      const success = await completeLesson(selectedLesson.id, selectedLesson.ecoPoints)
      if (success) {
        setRecentAchievement(`Completed: ${selectedLesson.title}`)
        setTimeout(() => setRecentAchievement(null), 3000)
        
        // Check for level up
        if (level > oldLevel) {
          setLevelUpData({ newLevel: level, pointsEarned: selectedLesson.ecoPoints })
          setShowLevelUp(true)
          setTimeout(() => {
            setShowLevelUp(false)
            setLevelUpData(null)
          }, 4000)
        }
        
      setSelectedLesson(null)
      }
      setIsCompleting(false)
    }
  }

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
  }

  const handleQuizComplete = async (score: number, timeSpent: number) => {
    console.log('Quiz completed:', { score, timeSpent })
    if (score >= (selectedQuiz?.passingScore || 70)) {
      const oldLevel = level
      const pointsToAdd = selectedQuiz?.ecoPoints || 0
      
      try {
        const success = await addPoints(pointsToAdd, `Completed quiz: ${selectedQuiz?.title}`, 'quiz', selectedQuiz?.id)
        if (success) {
          // Show achievement notification
          setRecentAchievement(`+${pointsToAdd} points! Quiz completed: ${selectedQuiz?.title}`)
          setTimeout(() => setRecentAchievement(null), 4000)
          
          // Check for level up
          if (level > oldLevel) {
            setLevelUpData({ newLevel: level, pointsEarned: pointsToAdd })
            setShowLevelUp(true)
            setTimeout(() => {
              setShowLevelUp(false)
              setLevelUpData(null)
            }, 4000)
          }
        }
      } catch (error) {
        console.error('Error adding quiz points:', error)
        setRecentAchievement(`Error: Could not add points for quiz completion`)
        setTimeout(() => setRecentAchievement(null), 3000)
      }
    } else {
      // Show encouragement for not passing
      setRecentAchievement(`Keep trying! You need ${selectedQuiz?.passingScore || 70}% to pass and earn points.`)
      setTimeout(() => setRecentAchievement(null), 4000)
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
          <Link href="/sign-in" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Sign In
          </Link>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Banner */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <motion.div className="absolute -left-10 top-10 w-40 h-40 bg-white/10 rounded-full" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
            <motion.div className="absolute -right-16 bottom-10 w-48 h-48 bg-white/10 rounded-full" animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 5, delay: 0.3 }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button onClick={() => setSelectedLesson(null)} className="inline-flex items-center text-white/90 hover:text-white mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Lessons
            </button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{selectedLesson.title}</h1>
                <p className="text-white/90 mt-1 max-w-2xl">{selectedLesson.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white capitalize">{selectedLesson.difficulty}</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white flex items-center"><Clock className="w-4 h-4 mr-1" />{selectedLesson.duration} min</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white flex items-center"><Star className="w-4 h-4 mr-1" />{selectedLesson.ecoPoints} pts</span>
              </div>
            </div>
          </div>
          </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Video Player */}
          {selectedLesson.type === 'video' && (
            <div className="mb-8">
              <VideoPlayer src={selectedLesson.mediaUrl || ''} title={selectedLesson.title} onComplete={handleLessonComplete} onProgress={() => {}} resumeKey={`lesson:${selectedLesson.id}`} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">🌱</span>
                  <h2 className="text-xl font-semibold text-gray-900">Lesson Content</h2>
                </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
            </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {selectedLesson.tags?.slice(0, 6).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">#{tag}</span>
                  ))}
                  </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{selectedLesson.duration} min</span>
                    <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" />{selectedLesson.ecoPoints} points</span>
                  </div>
                  <button onClick={handleLessonComplete} disabled={isCompleting} className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${isCompleting ? 'bg-emerald-300 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'}`}>
                    {isCompleting ? 'Completing…' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center"><Leaf className="w-4 h-4 mr-2 text-emerald-600" />Eco Tip</h3>
                <p className="text-sm text-gray-700">After watching, list 2 actions you can take this week to reduce your carbon footprint. Small steps make a big impact.</p>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />Your Rewards</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" />{selectedLesson.ecoPoints} Eco Points</li>
                  <li className="flex items-center"><Trophy className="w-4 h-4 mr-2 text-emerald-600" />Progress toward next level</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Achievement Notification */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">{recentAchievement}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && levelUpData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Level Up!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 mb-4"
              >
                You reached Level {levelUpData.newLevel}!
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center space-x-2 text-white/90"
              >
                <Star className="w-5 h-5" />
                <span>+{levelUpData.pointsEarned} points earned</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <motion.div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
            <motion.div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} />
            <motion.div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} />
            <motion.div className="absolute bottom-20 right-1/3 w-14 h-14 bg-white/10 rounded-full" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3.2, delay: 0.2 }} />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Section - Title and Description */}
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Eco Learning Hub
                </h1>
                <p className="text-lg text-white/90 max-w-md">
                  Master environmental sustainability through interactive, engaging content
                </p>
              </div>
              </div>
            
            {/* Right Section - Progress Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              {/* Completion Rate */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <motion.div className="text-2xl font-bold text-white mb-1">
                  {animatedCompletionText}
                </motion.div>
                <div className="text-sm text-white/80">Complete</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                    style={{ width: animatedCompletionWidth }}
                  ></motion.div>
              </div>
            </div>
            
              {/* Points */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <motion.span className="text-2xl font-bold text-white">
                    {animatedPointsText}
                  </motion.span>
                </div>
                <div className="text-sm text-white/80">Eco Points</div>
              </div>
              
              {/* Level */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400 mr-1" />
                  <motion.span className="text-2xl font-bold text-white">
                    {animatedLevelText}
                  </motion.span>
                </div>
                <div className="text-sm text-white/80">Level</div>
                <div className="text-xs text-white/60 mt-1">{nextLevelPoints} to next</div>
              </div>
              
              {/* Streak */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Flame className="w-5 h-5 text-orange-400 mr-1" />
                  <span className="text-2xl font-bold text-white">{streak}</span>
              </div>
                <div className="text-sm text-white/80">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              {[
                { id: 'lessons', label: 'Lessons', icon: BookOpen, count: lessons.length, color: 'green' },
                { id: 'quizzes', label: 'Quizzes', icon: Target, count: quizzes.length, color: 'blue' },
                { id: 'progress', label: 'Progress', icon: TrendingUp, count: null, color: 'purple' }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = selectedTab === tab.id
                const colorClasses = {
                  green: isActive ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50',
                  blue: isActive ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50',
                  purple: isActive ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50'
                }
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as 'lessons' | 'quizzes' | 'progress')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${colorClasses[tab.color as keyof typeof colorClasses]}`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                    {tab.count !== null && (
                      <motion.span 
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          isActive ? 'bg-white/20' : 'bg-gray-100'
                        }`}
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {tab.count}
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content with Transitions */}
        <AnimatePresence mode="wait">
        {selectedTab === 'lessons' && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
            {/* Enhanced Filters */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                        placeholder="Search environmental lessons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Difficulties</option>
                    <option value="beginner">🌱 Beginner</option>
                    <option value="intermediate">🌿 Intermediate</option>
                    <option value="advanced">🌳 Advanced</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                    <option value="video">🎥 Video</option>
                    <option value="interactive">⚡ Interactive</option>
                    <option value="infographic">📊 Infographic</option>
                </select>
                </div>
              </div>
            </div>

            {/* Enhanced Lessons Grid */}
            {lessonsError && (
              <div className="mb-4 text-red-600">{lessonsError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                return (
                  <motion.div
                  key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden ${
                      isCompleted ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-green-500 text-white p-2 rounded-full">
                          <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        )}

                    {/* Header with Icon */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          lesson.type === 'video' ? 'bg-blue-100 text-blue-600' :
                          lesson.type === 'interactive' ? 'bg-purple-100 text-purple-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {getThemeIcon(lesson.type)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {lesson.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.duration}m
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {lesson.ecoPoints}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleStartLesson(lesson.id)}
                          disabled={isCompleted}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isCompleted
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'Start Lesson'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            </motion.div>
          )}

        {selectedTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {quizzes.map((quiz, index) => {
                  const difficultyColors = {
                    easy: { bg: 'from-green-400 to-emerald-500', icon: 'bg-green-100', text: 'text-green-600' },
                    medium: { bg: 'from-yellow-400 to-orange-500', icon: 'bg-yellow-100', text: 'text-yellow-600' },
                    hard: { bg: 'from-red-400 to-pink-500', icon: 'bg-red-100', text: 'text-red-600' }
                  }
                  
                  const getDifficulty = (score: number) => {
                    if (score >= 80) return 'hard'
                    if (score >= 70) return 'medium'
                    return 'easy'
                  }
                  
                  const difficulty = getDifficulty(quiz.passingScore)
                  const colorScheme = difficultyColors[difficulty as keyof typeof difficultyColors]
                  
                  return (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      whileHover={{ scale: 1.03, y: -8 }}
                      className="group relative"
                    >
                      {/* Gradient Border */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} rounded-3xl blur-sm group-hover:blur-md transition-all duration-300 opacity-75`}></div>
                      
                      {/* Main Card */}
                      <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6 relative z-10">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 ${colorScheme.icon} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <div className="text-2xl">
                                {quiz.id === '1' && '🌍'}
                                {quiz.id === '2' && '♻️'}
                                {quiz.id === '3' && '⚡'}
                                {quiz.id === '4' && '🌿'}
                              </div>
                            </div>
                            <div>
                              <h3 className={`text-xl font-bold text-gray-900 group-hover:${colorScheme.text} transition-colors duration-300 mb-2`}>
                                {quiz.title}
                              </h3>
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                  {quiz.questions.length} questions
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorScheme.text} bg-gray-50`}>
                                  {difficulty.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quiz Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <div className="text-lg font-bold text-blue-600">{quiz.timeLimit}</div>
                            <div className="text-xs text-blue-600">minutes</div>
                          </div>
                          
                          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                            <div className="text-lg font-bold text-yellow-600">{quiz.ecoPoints}</div>
                            <div className="text-xs text-yellow-600">eco points</div>
                          </div>
                          
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                            <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                            <div className="text-lg font-bold text-purple-600">{quiz.passingScore}%</div>
                            <div className="text-xs text-purple-600">to pass</div>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-6 relative z-10">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {quiz.id === '1' && 'Test your knowledge of climate science, global warming, and environmental impacts. Master the fundamentals of our changing planet.'}
                            {quiz.id === '2' && 'Challenge yourself with advanced recycling concepts, waste reduction strategies, and circular economy principles.'}
                            {quiz.id === '3' && 'Explore renewable energy technologies, sustainability practices, and clean energy solutions for the future.'}
                            {quiz.id === '4' && 'Dive deep into biodiversity conservation, ecosystem services, and wildlife protection strategies.'}
                          </p>
                        </div>
                        
                        {/* Action Button */}
                        <motion.button
                          onClick={() => handleStartQuiz(quiz)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full bg-gradient-to-r ${colorScheme.bg} hover:shadow-2xl text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:scale-105 transform relative z-10 flex items-center justify-center space-x-3`}
                        >
                          <span>🚀</span>
                          <span>Start Quiz Challenge</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
            </motion.div>
        )}

        {selectedTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
          <div className="space-y-8">
                {/* Enhanced Progress Overview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Your Learning Journey</h3>
                      <p className="text-gray-600">Track your environmental education progress</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
                    >
                      <motion.div className="text-4xl font-bold text-green-600 mb-2">
                        {animatedCompletionText}
                      </motion.div>
                      <div className="text-sm text-gray-600 mb-2">Completion Rate</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: animatedCompletionWidth }}
                        ></motion.div>
                  </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-6 h-6 text-yellow-500 mr-2" />
                        <motion.span className="text-4xl font-bold text-blue-600">
                          {animatedPointsText}
                        </motion.span>
                </div>
                      <div className="text-sm text-gray-600">Eco Points Earned</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                        <motion.span className="text-4xl font-bold text-purple-600">
                          {animatedLevelText}
                        </motion.span>
                </div>
                      <div className="text-sm text-gray-600">Current Level</div>
                      <div className="text-xs text-gray-500 mt-1">{nextLevelPoints} to next level</div>
                    </motion.div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <Flame className="w-6 h-6 text-orange-500 mr-2" />
                        <span className="text-4xl font-bold text-orange-600">{streak}</span>
                </div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                      <p className="text-gray-600">Your latest learning achievements</p>
                    </div>
                  </div>
                  
              <div className="space-y-4">
                    {completedLessons.length > 0 ? (
                      completedLessons.slice(-5).reverse().map((lessonId, index) => {
                    const lesson = lessons.find(l => l.id === lessonId)
                    return lesson ? (
                          <div key={lessonId} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                          <div>
                                <p className="text-gray-900 font-semibold">{lesson.title}</p>
                                <p className="text-sm text-gray-600">Completed {index + 1} day ago</p>
                          </div>
                        </div>
                            <div className="flex items-center text-green-600 font-semibold">
                              <Star className="w-4 h-4 mr-1" />
                              +{lesson.ecoPoints}
                            </div>
                      </div>
                    ) : null
                  })
                ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
                        <p className="text-gray-500 text-lg mb-2">No completed lessons yet</p>
                        <p className="text-gray-400">Start your environmental learning journey!</p>
          </div>
        )}
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Your Environmental Impact</h3>
                      <p className="text-gray-600">Estimated impact of your learning</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <TreePine className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-green-600 mb-1">{Math.floor(totalPoints / 10)}</div>
                      <div className="text-sm text-gray-600">Trees Planted</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-blue-600 mb-1">{Math.floor(totalPoints / 5)}</div>
                      <div className="text-sm text-gray-600">Gallons Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                      <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-yellow-600 mb-1">{Math.floor(totalPoints / 15)}</div>
                      <div className="text-sm text-gray-600">CO₂ Reduced (kg)</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
