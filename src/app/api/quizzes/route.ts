import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

interface QuizData {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionsCount: number
  estimatedTime: number
  isCompleted: boolean
  bestScore?: number
  lastAttempt?: string
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    const queryUserId = searchParams.get('userId') || userId

    if (!queryUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Get all quizzes with user completion status
    const result = await db.query(`
      SELECT 
        q.id,
        q.title,
        q.description,
        q.category,
        q.difficulty,
        q.questions_count,
        q.estimated_time_minutes as estimated_time,
        CASE WHEN qr.id IS NOT NULL THEN true ELSE false END as is_completed,
        qr.score as best_score,
        qr.completed_at as last_attempt
      FROM quizzes q
      LEFT JOIN (
        SELECT DISTINCT ON (qr1.quiz_id) 
          qr1.id, qr1.quiz_id, qr1.score, qr1.completed_at
        FROM quiz_results qr1
        WHERE qr1.user_id = $1
        ORDER BY qr1.quiz_id, qr1.score DESC, qr1.completed_at DESC
      ) qr ON q.id = qr.quiz_id
      WHERE q.is_active = true
      ORDER BY q.created_at ASC
    `, [queryUserId])

    const quizzes: QuizData[] = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
      questionsCount: parseInt(row.questions_count),
      estimatedTime: parseInt(row.estimated_time),
      isCompleted: row.is_completed,
      bestScore: row.best_score ? parseInt(row.best_score) : undefined,
      lastAttempt: row.last_attempt
    }))

    return NextResponse.json(quizzes)

  } catch (error) {
    console.error('Error in /api/quizzes:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}


