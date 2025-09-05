import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Mock data - in production, this would come from a database
const lessons = [
  {
    id: '1',
    title: 'Introduction to Climate Change',
    description: 'Learn the basics of climate change and its impact on our planet',
    content: 'Climate change refers to long-term shifts in global temperatures and weather patterns...',
    type: 'video',
    mediaUrl: 'https://example.com/video1.mp4',
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
  }
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const tags = searchParams.get('tags')?.split(',')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredLessons = lessons

    if (difficulty) {
      filteredLessons = filteredLessons.filter(lesson => lesson.difficulty === difficulty)
    }

    if (tags && tags.length > 0) {
      filteredLessons = filteredLessons.filter(lesson => 
        tags.some(tag => lesson.tags.includes(tag))
      )
    }

    filteredLessons = filteredLessons.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredLessons,
      total: filteredLessons.length
    })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is teacher or admin
    // This would be implemented with proper role checking
    
    const body = await request.json()
    const { title, description, content, type, mediaUrl, duration, difficulty, ecoPoints, prerequisites, tags } = body

    // Validate required fields
    if (!title || !description || !content || !type || !duration || !difficulty || !ecoPoints) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new lesson
    const newLesson = {
      id: (lessons.length + 1).toString(),
      title,
      description,
      content,
      type,
      mediaUrl,
      duration,
      difficulty,
      ecoPoints,
      prerequisites: prerequisites || [],
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    lessons.push(newLesson)

    return NextResponse.json({
      success: true,
      data: newLesson
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
