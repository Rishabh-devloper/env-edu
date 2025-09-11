import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Mock data - in production, this would come from a database
const mockTasks = [
  {
    id: '1',
    title: 'Plant a Tree in Your Neighborhood',
    description: 'Plant a sapling and document its growth over time with weekly photos',
    category: 'conservation',
    points: 200,
    difficulty: 'medium' as const,
    estimatedTime: '2-3 hours',
    instructions: [
      'Choose a suitable location with proper sunlight and space',
      'Dig a hole twice the width of the root ball',
      'Plant the sapling at the correct depth',
      'Water thoroughly and add mulch around the base',
      'Take before and after photos, including location details'
    ],
    submissionType: 'photo' as const,
    status: 'available' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'Document Local Pollution Sources',
    description: 'Identify and photograph environmental issues in your community',
    category: 'awareness',
    points: 150,
    difficulty: 'easy' as const,
    estimatedTime: '1-2 hours',
    instructions: [
      'Walk through different areas of your neighborhood',
      'Take photos of pollution sources (air, water, soil, noise)',
      'Note the location and time of each observation',
      'Describe the type and severity of pollution',
      'Suggest possible solutions or improvements'
    ],
    submissionType: 'both' as const,
    status: 'available' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Organize a Recycling Drive',
    description: 'Collect and properly sort recyclable materials in your area',
    category: 'recycling',
    points: 300,
    difficulty: 'hard' as const,
    estimatedTime: '4-6 hours',
    instructions: [
      'Plan and organize a community recycling event',
      'Set up collection points for different materials',
      'Educate participants about proper sorting',
      'Weigh and document collected materials',
      'Ensure proper disposal at recycling centers'
    ],
    submissionType: 'both' as const,
    status: 'available' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Energy Audit at Home',
    description: 'Conduct a comprehensive energy usage assessment',
    category: 'energy',
    points: 180,
    difficulty: 'medium' as const,
    estimatedTime: '2-3 hours',
    instructions: [
      'Check all electrical appliances and their usage',
      'Measure electricity consumption over a week',
      'Identify energy-wasting practices',
      'Create an energy-saving action plan',
      'Implement changes and measure improvements'
    ],
    submissionType: 'text' as const,
    status: 'available' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Beach/Park Cleanup Initiative',
    description: 'Organize and execute a local cleanup drive',
    category: 'conservation',
    points: 250,
    difficulty: 'medium' as const,
    estimatedTime: '3-4 hours',
    instructions: [
      'Choose a local beach, park, or natural area',
      'Gather volunteers and cleaning supplies',
      'Document the before state with photos',
      'Collect and sort waste materials',
      'Take after photos and report collected amounts'
    ],
    submissionType: 'photo' as const,
    status: 'available' as const,
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')

    // Return all available tasks for demo
    // In production, you would filter based on user permissions, status, etc.
    
    return NextResponse.json({
      success: true,
      tasks: mockTasks,
      totalTasks: mockTasks.length,
      availableTasks: mockTasks.filter(task => task.status === 'available').length
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
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

    const body = await request.json()
    const { title, description, instructions, ecoPoints, deadline, proofType, assignedTo } = body

    // Validate required fields
    if (!title || !description || !instructions || !ecoPoints || !deadline || !proofType || !assignedTo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new task
    const newTask = {
      id: (tasks.length + 1).toString(),
      title,
      description,
      instructions,
      ecoPoints,
      deadline: new Date(deadline),
      proofType,
      assignedBy: userId,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [assignedTo],
      submissions: [],
      status: 'active',
      createdAt: new Date()
    }

    tasks.push(newTask)

    return NextResponse.json({
      success: true,
      data: newTask
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
