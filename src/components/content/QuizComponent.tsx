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
  }, [timeLeft, isSubmitted, quiz.questions, quiz.timeLimit, selectedAnswers, onComplete])

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
      <div className="max-w-4xl mx-auto p-6">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
              passed 
                ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600'
            }`}>
              {passed ? (
                <div className="text-6xl animate-bounce">🎉</div>
              ) : (
                <div className="text-6xl animate-pulse">💪</div>
              )}
            </div>
            
            {/* Decorative rings */}
            <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-spin ${
              passed ? 'border-green-300' : 'border-orange-300'
            } opacity-30`} style={{animationDuration: '3s'}}></div>
            <div className={`absolute -inset-4 rounded-full border-2 border-dotted animate-spin ${
              passed ? 'border-emerald-200' : 'border-pink-200'
            } opacity-20`} style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
          </div>
          
          <h2 className={`text-4xl font-bold mb-3 ${
            passed 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'
          }`}>
            {passed ? 'Outstanding! 🏆' : 'Keep Learning! 🚀'}
          </h2>
          <p className="text-xl text-gray-600 font-medium mb-2">
            You scored <span className={`font-bold text-2xl ${
              passed ? 'text-green-600' : 'text-orange-600'
            }`}>{score}%</span> on
          </p>
          <p className="text-lg text-gray-500 mb-4">"{quiz.title}"</p>
          
          {/* Points Earned Animation */}
          {earnedPoints > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl px-6 py-3 shadow-lg">
                <div className="text-2xl mr-3 animate-bounce">🎆</div>
                <div>
                  <div className="text-lg font-bold text-yellow-700">+{earnedPoints} Eco Points Earned!</div>
                  <div className="text-sm text-yellow-600">Added to your account</div>
                </div>
                <div className="text-2xl ml-3 animate-pulse">✨</div>
              </div>
            </div>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  passed ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className={`text-3xl font-bold ${
                  passed ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {score}%
                </div>
              </div>
              <div className="text-gray-600 font-medium">Your Score</div>
              <div className={`text-sm mt-1 ${
                passed ? 'text-green-600' : 'text-orange-600'
              }`}>
                {passed ? 'Excellent work!' : 'Room for improvement'}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <div className="text-3xl font-bold text-yellow-600">
                  {earnedPoints}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Eco Points</div>
              <div className={`text-sm mt-1 font-semibold ${
                earnedPoints > 0 ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {earnedPoints > 0 ? `+${earnedPoints} Points Added! 🎉` : 'Try again to earn points'}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {quiz.questions.length}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Total Questions</div>
              <div className="text-sm text-purple-600 mt-1">
                {correctCount} correct, {incorrectCount} incorrect
              </div>
            </div>
          </div>
          
          {/* Enhanced Result Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Performance Breakdown
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-semibold">Correct: {correctCount}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
                <span className="text-red-700 font-semibold">Incorrect: {incorrectCount}</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${correctPct}%` }}
                ></div>
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${incorrectPct}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{correctPct}% correct</span>
              <span>{incorrectPct}% incorrect</span>
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

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExit}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-3">✅</span>
              Complete Quiz
            </button>
            
            <button
              onClick={onExit}
              className="flex items-center px-8 py-4 bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-3">📚</span>
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
                className="flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-3">🔄</span>
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Enhanced Quiz Header */}
      <div className="mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-1 shadow-2xl">
        <div className="bg-white rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {quiz.title}
                </h2>
                <p className="text-gray-600 font-medium">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                <Clock className="w-5 h-5 mr-2 text-red-500" />
                <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="font-bold text-yellow-600">{quiz.ecoPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Progress: {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
          </span>
          <span className="text-sm font-medium text-gray-500">
            {currentQuestion + 1}/{quiz.questions.length} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Enhanced Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-white font-bold text-lg">Q{currentQuestion + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>
          </div>

          {/* Enhanced Answer Options */}
          <div className="space-y-4">
            {(
              currentQ.type === 'true_false'
                ? ['True', 'False']
                : (currentQ.options || [])
            ).map((option, index) => {
              const isSelected = selectedAnswers[currentQ.id] === option
              const optionColors = [
                { bg: 'bg-gradient-to-r from-red-50 to-pink-50', border: 'border-red-200', selected: 'border-red-500 bg-gradient-to-r from-red-100 to-pink-100', radio: 'bg-red-500', hover: 'hover:border-red-300' },
                { bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', border: 'border-blue-200', selected: 'border-blue-500 bg-gradient-to-r from-blue-100 to-cyan-100', radio: 'bg-blue-500', hover: 'hover:border-blue-300' },
                { bg: 'bg-gradient-to-r from-green-50 to-emerald-50', border: 'border-green-200', selected: 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100', radio: 'bg-green-500', hover: 'hover:border-green-300' },
                { bg: 'bg-gradient-to-r from-purple-50 to-violet-50', border: 'border-purple-200', selected: 'border-purple-500 bg-gradient-to-r from-purple-100 to-violet-100', radio: 'bg-purple-500', hover: 'hover:border-purple-300' }
              ]
              const colorScheme = optionColors[index % optionColors.length]
              
              return (
                <label
                  key={index}
                  className={`group flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${
                    isSelected
                      ? `${colorScheme.selected} shadow-lg scale-102`
                      : `${colorScheme.bg} ${colorScheme.border} ${colorScheme.hover} hover:shadow-md`
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(currentQ.id, option)}
                    className="sr-only"
                  />
                  
                  {/* Custom Radio Button */}
                  <div className="relative mr-4 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-3 transition-all duration-300 ${
                      isSelected
                        ? `${colorScheme.radio} border-transparent shadow-lg`
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Option Letter */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 font-bold text-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-gray-800 shadow-md'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  {/* Option Text */}
                  <span className={`text-gray-800 font-medium flex-1 transition-all duration-300 ${
                    isSelected ? 'text-gray-900' : 'group-hover:text-gray-900'
                  }`}>
                    {option}
                  </span>
                  
                  {/* Check Icon */}
                  {isSelected && (
                    <div className="ml-4 text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <button
          onClick={onExit}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-red-200"
        >
          <span className="mr-2">❌</span>
          Exit Quiz
        </button>
        
        <div className="flex items-center space-x-4">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-xl font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
            >
              <span className="mr-2">⬅️</span>
              Previous
            </button>
          )}
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!selectedAnswers[currentQ.id]}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              Next
              <span className="ml-2">➡️</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswers[currentQ.id]}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              <span className="mr-2">🚀</span>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
