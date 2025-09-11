import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import BadgeSystem from '@/lib/badge-system'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { quizId, score, answers, completedAt } = body

    if (!quizId || score === undefined || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Calculate points based on score
    let pointsEarned = Math.max(0, Math.round(score * 2)) // 2 points per percentage point
    
    // Bonus points for perfect scores
    if (score === 100) {
      pointsEarned += 50 // Perfect score bonus
    } else if (score >= 90) {
      pointsEarned += 25 // Excellent score bonus
    } else if (score >= 80) {
      pointsEarned += 10 // Good score bonus
    }

    // Save quiz result to database
    const resultQuery = await db.query(`
      INSERT INTO quiz_results (user_id, quiz_id, score, answers, completed_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [userId, quizId, score, JSON.stringify(answers), completedAt || new Date().toISOString()])

    const resultId = resultQuery.rows[0].id

    // Update user progress with quiz completion
    await BadgeSystem.updateUserProgress(userId, 'quiz', {
      points: pointsEarned,
      quizScore: score,
      quizId: quizId
    })

    // Check for new badges (this happens automatically in updateUserProgress)
    
    return NextResponse.json({
      success: true,
      resultId,
      pointsEarned,
      score,
      message: `Quiz completed! Score: ${score}%`
    })

  } catch (error) {
    console.error('Error completing quiz:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to complete quiz'
      }, 
      { status: 500 }
    )
  }
}
