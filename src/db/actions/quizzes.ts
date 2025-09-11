import { db } from '@/db'
import { quizzes, quizAttempts, lessons } from '@/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { QuizQuestion, QuizAnswer } from '@/db/schema'

export async function getQuizzes(lessonId?: string) {
  try {
    let query = db.select().from(quizzes)
    
    if (lessonId) {
      query = query.where(eq(quizzes.lessonId, lessonId))
    }
    
    const result = await query.orderBy(desc(quizzes.createdAt))
    return result
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return []
  }
}

export async function getQuizById(quizId: string) {
  try {
    const result = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return null
  }
}

export async function createQuizAttempt(
  userId: string,
  quizId: string,
  answers: QuizAnswer[],
  score: number,
  timeSpent: number
) {
  try {
    const quiz = await getQuizById(quizId)
    if (!quiz) throw new Error('Quiz not found')

    const correctAnswers = answers.filter(a => a.isCorrect).length
    const totalQuestions = quiz.questions.length
    const passed = score >= quiz.passingScore

    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.insert(quizAttempts).values({
      id: attemptId,
      userId,
      quizId,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      answers,
      passed
    })

    return { success: true, attemptId, passed, pointsEarned: passed ? quiz.ecoPoints : 0 }
  } catch (error) {
    console.error('Error creating quiz attempt:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getUserQuizAttempts(userId: string, limit = 10) {
  try {
    const result = await db
      .select({
        attempt: quizAttempts,
        quiz: quizzes
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.completedAt))
      .limit(limit)

    return result
  } catch (error) {
    console.error('Error fetching user quiz attempts:', error)
    return []
  }
}

export async function getQuizStats(userId: string) {
  try {
    const attempts = await getUserQuizAttempts(userId, 100)
    
    const totalAttempts = attempts.length
    const passedAttempts = attempts.filter(a => a.attempt.passed).length
    const totalPoints = attempts
      .filter(a => a.attempt.passed)
      .reduce((sum, a) => sum + a.quiz.ecoPoints, 0)
    
    const averageScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.attempt.score, 0) / attempts.length)
      : 0

    return {
      totalAttempts,
      passedAttempts,
      totalPoints,
      averageScore,
      passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0
    }
  } catch (error) {
    console.error('Error calculating quiz stats:', error)
    return {
      totalAttempts: 0,
      passedAttempts: 0,
      totalPoints: 0,
      averageScore: 0,
      passRate: 0
    }
  }
}

// Seed quizzes with environmental content
export async function seedQuizzes() {
  try {
    const existingQuizzes = await getQuizzes()
    if (existingQuizzes.length > 0) return

    const quizData = [
      {
        id: 'quiz_climate_basics',
        title: 'Climate Change Fundamentals',
        description: 'Test your knowledge of climate change basics',
        lessonId: '1',
        questions: [
          {
            id: 'q1',
            question: 'What is the primary cause of recent climate change?',
            type: 'multiple_choice' as const,
            options: ['Natural climate cycles', 'Human greenhouse gas emissions', 'Solar radiation changes', 'Volcanic activity'],
            correctAnswer: 'Human greenhouse gas emissions',
            explanation: 'While natural factors influence climate, human activities, particularly greenhouse gas emissions, are the primary driver of recent climate change.',
            points: 10
          },
          {
            id: 'q2',
            question: 'True or False: Climate change only affects temperature.',
            type: 'true_false' as const,
            correctAnswer: 'False',
            explanation: 'Climate change affects many aspects of the climate system including precipitation patterns, sea levels, extreme weather events, and ecosystems.',
            points: 10
          },
          {
            id: 'q3',
            question: 'Which greenhouse gas has the highest concentration in the atmosphere?',
            type: 'multiple_choice' as const,
            options: ['Methane', 'Carbon dioxide', 'Nitrous oxide', 'Water vapor'],
            correctAnswer: 'Carbon dioxide',
            explanation: 'CO2 is the most abundant greenhouse gas from human activities and has increased significantly since the industrial revolution.',
            points: 10
          },
          {
            id: 'q4',
            question: 'What is the main source of carbon dioxide emissions?',
            type: 'multiple_choice' as const,
            options: ['Deforestation', 'Burning fossil fuels', 'Agriculture', 'Industrial processes'],
            correctAnswer: 'Burning fossil fuels',
            explanation: 'Burning fossil fuels for electricity, transportation, and heating is the largest source of CO2 emissions globally.',
            points: 10
          },
          {
            id: 'q5',
            question: 'True or False: The Paris Agreement aims to limit global warming to 2°C above pre-industrial levels.',
            type: 'true_false' as const,
            correctAnswer: 'True',
            explanation: 'The Paris Agreement aims to limit global temperature rise to well below 2°C, with efforts to limit it to 1.5°C.',
            points: 10
          }
        ],
        timeLimit: 10,
        passingScore: 70,
        ecoPoints: 50,
        difficulty: 'beginner'
      },
      {
        id: 'quiz_renewable_energy',
        title: 'Renewable Energy Sources',
        description: 'Learn about clean energy alternatives',
        lessonId: '2',
        questions: [
          {
            id: 'q1',
            question: 'Which renewable energy source is most widely used globally?',
            type: 'multiple_choice' as const,
            options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
            correctAnswer: 'Hydroelectric',
            explanation: 'Hydroelectric power is the most widely used renewable energy source globally, providing about 16% of the world\'s electricity.',
            points: 10
          },
          {
            id: 'q2',
            question: 'True or False: Solar panels work only in direct sunlight.',
            type: 'true_false' as const,
            correctAnswer: 'False',
            explanation: 'Solar panels can generate electricity even on cloudy days, though at reduced efficiency compared to direct sunlight.',
            points: 10
          },
          {
            id: 'q3',
            question: 'What is the main advantage of wind energy?',
            type: 'multiple_choice' as const,
            options: ['Low cost', 'No emissions during operation', 'Works everywhere', 'No maintenance needed'],
            correctAnswer: 'No emissions during operation',
            explanation: 'Wind energy produces no greenhouse gas emissions during operation, making it a clean energy source.',
            points: 10
          },
          {
            id: 'q4',
            question: 'Which factor limits the widespread adoption of renewable energy?',
            type: 'multiple_choice' as const,
            options: ['High cost', 'Intermittency', 'Low efficiency', 'All of the above'],
            correctAnswer: 'All of the above',
            explanation: 'While renewable energy is becoming more cost-effective, challenges include intermittency, storage needs, and initial costs.',
            points: 10
          },
          {
            id: 'q5',
            question: 'True or False: Geothermal energy is available everywhere on Earth.',
            type: 'true_false' as const,
            correctAnswer: 'False',
            explanation: 'Geothermal energy is only viable in areas with high heat flow from the Earth\'s interior, typically near tectonic plate boundaries.',
            points: 10
          }
        ],
        timeLimit: 12,
        passingScore: 80,
        ecoPoints: 75,
        difficulty: 'intermediate'
      },
      {
        id: 'quiz_waste_reduction',
        title: 'Waste Reduction Strategies',
        description: 'Master the art of reducing waste',
        lessonId: '3',
        questions: [
          {
            id: 'q1',
            question: 'What is the most effective way to reduce waste?',
            type: 'multiple_choice' as const,
            options: ['Recycling', 'Composting', 'Reducing consumption', 'Burning waste'],
            correctAnswer: 'Reducing consumption',
            explanation: 'The most effective waste reduction strategy is to reduce consumption and avoid creating waste in the first place.',
            points: 10
          },
          {
            id: 'q2',
            question: 'True or False: All plastics can be recycled.',
            type: 'true_false' as const,
            correctAnswer: 'False',
            explanation: 'Not all plastics can be recycled. Only certain types (usually marked with recycling symbols 1-7) are accepted by most recycling programs.',
            points: 10
          },
          {
            id: 'q3',
            question: 'What percentage of household waste can be composted?',
            type: 'multiple_choice' as const,
            options: ['20%', '40%', '60%', '80%'],
            correctAnswer: '60%',
            explanation: 'Approximately 60% of household waste consists of organic materials that can be composted.',
            points: 10
          },
          {
            id: 'q4',
            question: 'Which item takes the longest to decompose in a landfill?',
            type: 'multiple_choice' as const,
            options: ['Paper', 'Food waste', 'Glass', 'Aluminum cans'],
            correctAnswer: 'Glass',
            explanation: 'Glass can take up to 1 million years to decompose in a landfill, making it one of the longest-lasting materials.',
            points: 10
          },
          {
            id: 'q5',
            question: 'True or False: Biodegradable plastics break down quickly in landfills.',
            type: 'true_false' as const,
            correctAnswer: 'False',
            explanation: 'Biodegradable plastics often require specific conditions (like high heat and oxygen) to break down, which landfills typically don\'t provide.',
            points: 10
          }
        ],
        timeLimit: 15,
        passingScore: 75,
        ecoPoints: 60,
        difficulty: 'intermediate'
      }
    ]

    for (const quiz of quizData) {
      await db.insert(quizzes).values(quiz)
    }

    return { success: true, count: quizData.length }
  } catch (error) {
    console.error('Error seeding quizzes:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}




