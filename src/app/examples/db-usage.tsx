'use client'

import { useState, useEffect } from 'react'
import { getLessons } from '@/db/actions/lessons'
import { getProgress, addPoints } from '@/db/actions/progress'
import { getUserStats } from '@/db/actions/analytics'
import { SelectLesson } from '@/db/schema'

export default function DbUsageExample() {
  const [lessons, setLessons] = useState<SelectLesson[]>([])
  const [progress, setProgress] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // Load lessons
        const lessonsData = await getLessons({
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })
        setLessons(lessonsData)

        // Load user progress
        const progressData = await getProgress()
        setProgress(progressData)

        // Load user stats
        const statsData = await getUserStats()
        setStats(statsData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddPoints = async () => {
    try {
      const updatedProgress = await addPoints(10, 'Example action')
      setProgress(updatedProgress)
    } catch (err) {
      console.error('Error adding points:', err)
      setError('Failed to add points. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Usage Example</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Progress */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Progress</h2>
          {progress ? (
            <div>
              <p>Total Points: {progress.totalPoints}</p>
              <p>Level: {progress.level}</p>
              <p>Completed Lessons: {progress.completedLessonsCount}</p>
              <p>Streak: {progress.streak} days</p>
              <button
                onClick={handleAddPoints}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add 10 Points
              </button>
            </div>
          ) : (
            <p>No progress data available</p>
          )}
        </div>

        {/* User Stats */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Stats</h2>
          {stats ? (
            <div>
              <p>Total Points: {stats.totalPoints}</p>
              <p>Level: {stats.level}</p>
              <p>Badges: {stats.badges?.length || 0}</p>
              <p>Completed Lessons: {stats.completedLessons}</p>
              <h3 className="font-medium mt-2">Points by Activity:</h3>
              <ul className="mt-1">
                {stats.pointsByActivity?.map((item: any) => (
                  <li key={item.activityType || 'unknown'}>
                    {item.activityType || 'Other'}: {item.total} points ({item.count} activities)
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No stats available</p>
          )}
        </div>

        {/* Recent Lessons */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Lessons</h2>
          {lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border p-3 rounded">
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {lesson.type}
                    </span>
                    <span className="text-green-600">{lesson.ecoPoints} points</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No lessons available</p>
          )}
        </div>
      </div>
    </div>
  )
}