import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const taskId = formData.get('taskId') as string
    const text = formData.get('text') as string

    // Handle image uploads
    const images: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value)
      }
    }

    // In a real implementation, you would:
    // 1. Save images to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Save submission data to database
    // 3. Update user progress and points
    
    // For demo purposes, we'll simulate successful submission
    console.log('Task submission:', {
      userId,
      taskId,
      text,
      imageCount: images.length
    })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response data
    const submissionData = {
      id: `submission_${Date.now()}`,
      taskId,
      userId,
      text,
      images: images.map((_, index) => `uploaded_image_${index}.jpg`),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewStatus: 'pending'
    }

    return NextResponse.json({
      success: true,
      message: 'Task submitted successfully!',
      submission: submissionData
    })

  } catch (error) {
    console.error('Error in task submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit task' }, 
      { status: 500 }
    )
  }
}
