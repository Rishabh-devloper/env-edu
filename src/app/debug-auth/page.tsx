'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function DebugAuthPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { role, isStudent, isTeacher, isNGO, isAdmin } = useUserRole()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (isLoaded && user) {
      setDebugInfo({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        privateMetadata: user.privateMetadata,
        publicMetadata: user.publicMetadata,
        userRole: role,
        booleans: {
          isStudent,
          isTeacher,
          isNGO,
          isAdmin
        }
      })
    }
  }, [isLoaded, user, role, isStudent, isTeacher, isNGO, isAdmin])

  const assignRole = async (newRole: string) => {
    try {
      const response = await fetch('/api/auth/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
      
      const data = await response.json()
      console.log('Role assignment result:', data)
      
      if (response.ok) {
        // Refresh page to see updated role
        window.location.reload()
      } else {
        alert(`Failed to assign role: ${data.error}`)
      }
    } catch (error) {
      console.error('Error assigning role:', error)
      alert(`Error: ${error}`)
    }
  }

  if (!isLoaded) {
    return <div className="p-8">Loading authentication info...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
        <p className="text-red-600">Not signed in. Please sign in first.</p>
        <a href="/sign-in" className="text-blue-600 underline">Go to Sign In</a>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Auth Status</h2>
          <div className="space-y-2">
            <p><strong>Is Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
            <p><strong>Is Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
            <p><strong>Current Role:</strong> <span className="bg-blue-100 px-2 py-1 rounded">{role || 'No role assigned'}</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Role Checks</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${isStudent ? 'bg-green-100' : 'bg-gray-100'}`}>
              <strong>Student:</strong> {isStudent ? 'Yes ✅' : 'No ❌'}
            </div>
            <div className={`p-3 rounded ${isTeacher ? 'bg-green-100' : 'bg-gray-100'}`}>
              <strong>Teacher:</strong> {isTeacher ? 'Yes ✅' : 'No ❌'}
            </div>
            <div className={`p-3 rounded ${isNGO ? 'bg-green-100' : 'bg-gray-100'}`}>
              <strong>NGO:</strong> {isNGO ? 'Yes ✅' : 'No ❌'}
            </div>
            <div className={`p-3 rounded ${isAdmin ? 'bg-green-100' : 'bg-gray-100'}`}>
              <strong>Admin:</strong> {isAdmin ? 'Yes ✅' : 'No ❌'}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Role Assignment (Testing)</h2>
          <p className="text-sm text-gray-600 mb-4">Use these buttons to test role assignment:</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => assignRole('student')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Assign Student Role
            </button>
            <button 
              onClick={() => assignRole('teacher')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Assign Teacher Role
            </button>
            <button 
              onClick={() => assignRole('ngo')}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Assign NGO Role
            </button>
            <button 
              onClick={() => assignRole('admin')}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Assign Admin Role
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="space-x-2">
            <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block">Home</a>
            <a href="/student" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">Student Dashboard</a>
            <a href="/teacher" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block">Teacher Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}
