import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getLessons, createLesson } from '@/db/actions/lessons'
import { SelectLesson, InsertLesson } from '@/db/schema'
import { db } from '@/db'
import { lessons as lessonsTable } from '@/db/schema'

export async function GET(request: NextRequest) {
  try {
    // Public endpoint: do not require auth to view lessons
    // Still call auth to allow Clerk cookies to be read without enforcing
    await auth().catch(() => ({ userId: null }))

    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const tags = searchParams.get('tags')?.split(',')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || undefined
    const search = searchParams.get('search') || undefined

    let filteredLessons: Array<{
      id: string
      title: string
      description: string
      content: string
      type: string
      mediaUrl?: string
      duration: number
      difficulty: string
      ecoPoints: number
      prerequisites: string[]
      tags: string[]
      createdAt: string
      updatedAt: string
    }>

    try {
      const dbLessons = await getLessons({ type: type || undefined, difficulty: difficulty || undefined, search: search || undefined, limit })

      // Map DB records to client shape
      const toIso = (d?: Date | null) => (d instanceof Date ? d.toISOString() : '')
      const mapped = (dbLessons as SelectLesson[]).map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        content: l.description,
        type: l.type,
        mediaUrl: l.mediaUrl || undefined,
        duration: l.durationMin,
        difficulty: l.difficulty,
        ecoPoints: l.ecoPoints,
        prerequisites: [],
        tags: Array.isArray(l.tags) ? l.tags : [],
        createdAt: toIso((l as unknown as { createdAt?: Date }).createdAt),
        updatedAt: toIso((l as unknown as { updatedAt?: Date }).updatedAt),
      }))

      filteredLessons = (tags && tags.length > 0)
        ? mapped.filter(lesson => tags!.some(tag => lesson.tags.includes(tag)))
        : mapped

      // If DB is reachable but empty, seed with defaults provided
      if (filteredLessons.length === 0) {
        const defaultSeed = [
          { id: '1', title: 'Introduction to Climate Change', description: 'Learn the basics of climate change and its impact on our planet.', content: 'Climate change refers to long-term shifts in global temperatures and weather patterns...', type: 'video', mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 15, difficulty: 'beginner', ecoPoints: 50, prerequisites: [], tags: ['climate','environment','basics'] },
          { id: '2', title: 'Climate Change Explained Simply', description: 'A simple explanation of how climate change works and why it matters.', content: '', type: 'video', mediaUrl: 'https://youtu.be/G9t__9Tmwv4?si=vLaeYYdkMGSnyFHw', duration: 12, difficulty: 'beginner', ecoPoints: 40, prerequisites: [], tags: ['climate','basics','education'] },
          { id: '3', title: 'What is Climate Change?', description: 'Discover what climate change is and the science behind it.', content: '', type: 'video', mediaUrl: 'https://youtu.be/1b2VDJbvAtA?si=j--7WTkHsMTxS2hc', duration: 14, difficulty: 'beginner', ecoPoints: 45, prerequisites: [], tags: ['climate','science','environment'] },
          { id: '4', title: 'Causes of Climate Change', description: 'Learn about the human and natural causes contributing to climate change.', content: '', type: 'video', mediaUrl: 'https://youtu.be/9Edx5rKvfKk?si=95HrpB-IW98fpW2w', duration: 18, difficulty: 'intermediate', ecoPoints: 60, prerequisites: [], tags: ['causes','emissions','global warming'] },
          { id: '5', title: 'Climate Change Impacts', description: 'Understand how climate change impacts ecosystems, humans, and the planet.', content: '', type: 'video', mediaUrl: 'https://youtu.be/wvW53s4NfHE?si=RISMJUiSU0wxgn0P', duration: 20, difficulty: 'intermediate', ecoPoints: 70, prerequisites: [], tags: ['impacts','ecosystems','human health'] },
          { id: '6', title: 'Solutions to Climate Change', description: 'Explore global and local solutions to fight climate change.', content: '', type: 'video', mediaUrl: 'https://youtu.be/G4H1N_yXBiA?si=ibJD_kDySJd5XdVk', duration: 22, difficulty: 'intermediate', ecoPoints: 75, prerequisites: [], tags: ['solutions','sustainability','renewable energy'] },
          { id: '7', title: 'Global Warming Explained', description: 'A breakdown of how global warming works and its connection to climate change.', content: '', type: 'video', mediaUrl: 'https://youtu.be/jx3KXtjzwBU?si=5MLXpnqofjkFRytl', duration: 16, difficulty: 'beginner', ecoPoints: 50, prerequisites: [], tags: ['global warming','temperature rise','science'] },
          { id: '8', title: 'Climate Change and Future Generations', description: 'Learn how climate change will affect future generations if not addressed.', content: '', type: 'video', mediaUrl: 'https://youtu.be/aXIMYSe74ow?si=Knxrm27FCeikPlYP', duration: 19, difficulty: 'intermediate', ecoPoints: 65, prerequisites: [], tags: ['future','youth','responsibility'] },
          { id: '9', title: 'Effects of Climate Change on Earth', description: 'Detailed look at the environmental effects of rising temperatures and extreme weather.', content: '', type: 'video', mediaUrl: 'https://youtu.be/N6t6QHQtdVw?si=aOwZK-oQNFJlxDqe', duration: 21, difficulty: 'advanced', ecoPoints: 80, prerequisites: [], tags: ['effects','environment','extreme weather'] },
          { id: '10', title: 'How We Can Stop Climate Change', description: 'Practical actions and strategies individuals and communities can take.', content: '', type: 'video', mediaUrl: 'https://youtu.be/Ug9OUNAYPC4?si=wzckUfNiVr9W8SFO', duration: 17, difficulty: 'beginner', ecoPoints: 55, prerequisites: [], tags: ['actions','solutions','sustainability'] },
        ]

        const toInsert = defaultSeed.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          type: d.type,
          mediaUrl: d.mediaUrl,
          durationMin: d.duration,
          difficulty: d.difficulty,
          ecoPoints: d.ecoPoints,
          tags: d.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))

        await db.insert(lessonsTable).values(toInsert as InsertLesson[]).onConflictDoNothing()

        const seeded = await getLessons({ limit })
        const mappedSeeded = (seeded as SelectLesson[]).map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          content: l.description,
          type: l.type,
          mediaUrl: l.mediaUrl || undefined,
          duration: l.durationMin,
          difficulty: l.difficulty,
          ecoPoints: l.ecoPoints,
          prerequisites: [],
          tags: Array.isArray(l.tags) ? l.tags : [],
          createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : '',
          updatedAt: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : '',
        }))

        filteredLessons = mappedSeeded
      }
    } catch (dbError) {
      console.error('Lessons DB fetch failed, returning fallback data:', dbError)
      // Fallback data to keep UI working when DB is unavailable
      const fallback = [
        {
          id: 'fallback-1',
          title: 'Introduction to Climate Action',
          description: 'Quick overview lesson for when the database is unavailable.',
          content: 'Learn the basics of sustainability and immediate actions you can take.',
          type: 'video',
          mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          duration: 10,
          difficulty: 'beginner',
          ecoPoints: 40,
          prerequisites: [],
          tags: ['fallback', 'intro'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      filteredLessons = fallback
    }

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

    // Create new lesson in DB
    const payload: Omit<InsertLesson, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      type,
      mediaUrl,
      durationMin: duration,
      difficulty,
      ecoPoints,
      tags: (tags || []) as string[],
    }
    const created = await createLesson(payload)

    // Map to client shape
    const result = {
      id: created.id,
      title: created.title,
      description: created.description,
      content: content || created.description,
      type: created.type,
      mediaUrl: created.mediaUrl,
      duration: created.durationMin,
      difficulty: created.difficulty,
      ecoPoints: created.ecoPoints,
      prerequisites: prerequisites || [],
      tags: Array.isArray(created.tags) ? created.tags : [],
      createdAt: (created as unknown as { createdAt?: Date }).createdAt instanceof Date ? (created as unknown as { createdAt?: Date }).createdAt!.toISOString() : '',
      updatedAt: (created as unknown as { updatedAt?: Date }).updatedAt instanceof Date ? (created as unknown as { updatedAt?: Date }).updatedAt!.toISOString() : '',
    }

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
