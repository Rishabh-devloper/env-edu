import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
    const { taskId, impact, completedAt } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' }, 
        { status: 400 }
      )
    }

    // Calculate points based on task type and impact
    let pointsEarned = 50 // Base points for completing a task
    let category = 'general'

    // Add bonus points based on environmental impact
    if (impact) {
      if (impact.treesPlanted) {
        pointsEarned += impact.treesPlanted * 20 // 20 points per tree
        category = 'environmental'
      }
      if (impact.wasteRecycled) {
        pointsEarned += Math.round(impact.wasteRecycled * 5) // 5 points per kg
        category = 'recycling'
      }
      if (impact.energySaved) {
        pointsEarned += Math.round(impact.energySaved * 2) // 2 points per kWh
        category = 'energy'
      }
      if (impact.waterSaved) {
        pointsEarned += Math.round(impact.waterSaved * 0.1) // 0.1 points per liter
        category = 'water'
      }
    }

    // Update user progress with task completion
    await BadgeSystem.updateUserProgress(userId, 'task', {
      points: pointsEarned,
      taskCategory: category,
      environmentalImpact: impact
    })

    return NextResponse.json({
      success: true,
      pointsEarned,
      category,
      message: `Task completed! +${pointsEarned} points earned`
    })

  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to complete task'
      }, 
      { status: 500 }
    )
  }
}
