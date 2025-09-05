import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Mock data - in production, this would come from a database
const tasks = [
  {
    id: '1',
    title: 'Plant a Tree',
    description: 'Plant a tree in your community and document the process',
    instructions: '1. Choose a suitable location for planting\n2. Dig a hole twice the size of the root ball\n3. Place the tree and fill with soil\n4. Water thoroughly\n5. Take a photo of the planted tree',
    ecoPoints: 100,
    deadline: new Date('2024-12-31'),
    proofType: 'photo',
    assignedBy: 'teacher-1',
    assignedTo: ['student-1', 'student-2', 'student-3'],
    submissions: [],
    status: 'active',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Recycling Challenge',
    description: 'Collect and properly sort recyclable materials for one week',
    instructions: '1. Set up separate bins for different materials\n2. Collect recyclables for 7 days\n3. Take photos of your sorted materials\n4. Document the total weight collected',
    ecoPoints: 75,
    deadline: new Date('2024-12-31'),
    proofType: 'photo',
    assignedBy: 'teacher-1',
    assignedTo: ['student-1', 'student-2'],
    submissions: [],
    status: 'active',
    createdAt: new Date('2024-01-02')
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

    let filteredTasks = tasks

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }

    if (assignedTo === 'me') {
      filteredTasks = filteredTasks.filter(task => task.assignedTo.includes(userId))
    }

    return NextResponse.json({
      success: true,
      data: filteredTasks
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
