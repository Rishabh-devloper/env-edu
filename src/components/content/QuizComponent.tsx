


'use client'

import { useState, useEffect } from 'react'
import { Quiz } from '@/types'
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react'

interface QuizComponentProps {
  quiz: Quiz
  onComplete: (score: number, timeSpent: number, answers: Array<{questionId: string; answer: string | string[] | number; isCorrect: boolean; timeSpent: number}>) => void
  onExit: () => void
}

export default function QuizComponent({ quiz, onComplete, onExit }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | string[] }>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60) // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      // inline submit to avoid missing dependency churn
      const totalSeconds = quiz.timeLimit * 60
      const finalScore = (() => {
        let correct = 0
        quiz.questions.forEach(question => {
          const userAnswer = selectedAnswers[question.id]
          if (Array.isArray(question.correctAnswer)) {
            if (Array.isArray(userAnswer) && userAnswer.length === question.correctAnswer.length && userAnswer.every(ans => question.correctAnswer.includes(ans))) {
              correct++
            }
          } else {
            if (userAnswer === question.correctAnswer) {
              correct++
            }
          }
        })
        return Math.round((correct / quiz.questions.length) * 100)
      })()
      setIsSubmitted(true)
      setScore(finalScore)
      setShowResults(true)
      const answers = quiz.questions.map(q => ({
        questionId: q.id,
        answer: selectedAnswers[q.id] || '',
        isCorrect: selectedAnswers[q.id] === q.correctAnswer,
        timeSpent: 0
      }))
      onComplete(finalScore, totalSeconds, answers)
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id]
      if (Array.isArray(question.correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every(ans => question.correctAnswer.includes(ans))) {
          correct++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const handleSubmit = () => {
    if (isSubmitted) return
    
    setIsSubmitted(true)
    const finalScore = calculateScore()
    setScore(finalScore)
    setShowResults(true)
    
    // Calculate time spent
    const timeSpent = (quiz.timeLimit * 60) - timeLeft
    
    // Prepare answers for submission
    const answers = quiz.questions.map(q => ({
      questionId: q.id,
      answer: selectedAnswers[q.id] || '',
      isCorrect: selectedAnswers[q.id] === q.correctAnswer,
      timeSpent: 0 // Could be enhanced to track per-question time
    }))
    
    onComplete(finalScore, timeSpent, answers)
  }

  const currentQ = quiz.questions[currentQuestion]

  if (showResults) {
    const passed = score >= quiz.passingScore
    const earnedPoints = passed ? quiz.ecoPoints : 0

    // Build per-question correctness map
    const correctness = quiz.questions.map((q) => {
      const userAnswer = selectedAnswers[q.id]
      let isCorrect = false
      if (Array.isArray(q.correctAnswer)) {
        isCorrect = Array.isArray(userAnswer) && userAnswer.length === q.correctAnswer.length && userAnswer.every((a) => q.correctAnswer.includes(a))
      } else {
        isCorrect = userAnswer === q.correctAnswer
      }
      return { id: q.id, isCorrect }
    })
    const correctCount = correctness.filter((c) => c.isCorrect).length
    const incorrectCount = quiz.questions.length - correctCount
    const correctPct = Math.round((correctCount / quiz.questions.length) * 100)
    const incorrectPct = 100 - correctPct

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-emerald-800 mb-1">
            {passed ? 'Great job! 🌿' : 'Nice effort! 🌱'}
          </h2>
          <p className="text-emerald-700/80 mb-6">You scored {score}% on &quot;{quiz.title}&quot;</p>

          <div className="bg-white rounded-xl p-4 border border-emerald-100 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{earnedPoints}</div>
                <div className="text-sm text-gray-600">Eco Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </div>
            {/* Result Chart */}
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-green-700">Correct: {correctCount}</span>
              <span className="text-red-700">Incorrect: {incorrectCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-green-500" style={{ width: `${correctPct}%` }}></div>
              <div className="h-3 bg-red-400 -mt-3" style={{ width: `${incorrectPct}%` }}></div>
            </div>
          </div>

          {/* Review */}
          <div className="text-left space-y-3 mb-6">
            {quiz.questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id]
              const isCorrect = correctness[idx].isCorrect
              return (
                <div key={q.id} className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900">Q{idx + 1}. {q.question}</p>
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Your answer: <span className="font-medium">{Array.isArray(userAnswer) ? (userAnswer.join(', ') || '—') : (userAnswer || '—')}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-700">Correct answer: <span className="font-medium">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</span></p>
                  )}
                  {q.explanation && (
                    <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExit}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow"
            >
              Complete Quiz
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Lessons
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQuestion(0)
                  setSelectedAnswers({})
                  setTimeLeft(quiz.timeLimit * 60)
                  setIsSubmitted(false)
                  setShowResults(false)
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Themed Quiz Header */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-emerald-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-emerald-800">{quiz.title}</h2>
            <p className="text-emerald-700/80">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-emerald-800">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center text-emerald-700">
              <Award className="w-4 h-4 mr-1" />
              {quiz.ecoPoints} pts
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentQ.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {(
            currentQ.type === 'true_false'
              ? ['True', 'False']
              : (currentQ.options || [])
          ).map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedAnswers[currentQ.id] === option
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option}
                checked={selectedAnswers[currentQ.id] === option}
                onChange={() => handleAnswerSelect(currentQ.id, option)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswers[currentQ.id] === option
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswers[currentQ.id] === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onExit}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Exit Quiz
        </button>
        
        <div className="space-x-3">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!selectedAnswers[currentQ.id]}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswers[currentQ.id]}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
