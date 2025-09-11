import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getQuizzes, seedQuizzes } from '@/db/actions/quizzes'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    
    let quizzes = await getQuizzes(lessonId || undefined)
    
    // If no quizzes found, seed the database
    if (quizzes.length === 0) {
      const seedResult = await seedQuizzes()
      if (seedResult.success) {
        quizzes = await getQuizzes(lessonId || undefined)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: quizzes
    })
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { quizId, answers, score, timeSpent } = body

    if (!quizId || !answers || score === undefined || !timeSpent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { createQuizAttempt } = await import('@/db/actions/quizzes')
    const result = await createQuizAttempt(userId, quizId, answers, score, timeSpent)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          attemptId: result.attemptId,
          passed: result.passed,
          pointsEarned: result.pointsEarned
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz attempt' },
      { status: 500 }
    )
  }
}


