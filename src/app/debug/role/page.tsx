'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { UserRole } from '@/types'
import { RefreshCw, Check, AlertCircle, User } from 'lucide-react'

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'student',
    label: 'Student',
    description: 'Learn sustainability and complete eco-tasks'
  },
  {
    value: 'teacher',
    label: 'Teacher',
    description: 'Create lessons and manage student progress'
  },
  {
    value: 'ngo',
    label: 'NGO Member',
    description: 'Launch campaigns and track community impact'
  },
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Manage platform and all user operations'
  }
]

export default function RoleDebugPage() {
  const { user, isLoaded } = useUser()
  const { role, isStudent, isTeacher, isNGO, isAdmin } = useUserRole()
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher')
  const [isAssigning, setIsAssigning] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleAssignRole = async () => {
    if (!user) return

    setIsAssigning(true)
    setResult(null)

    try {
      // Try client-side approach first
      console.log('Attempting client-side role update...')
      
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          role: selectedRole
        }
      })
      
      setResult({
        type: 'success',
        message: `Role successfully changed to ${selectedRole} using client-side method. Refreshing in 2 seconds...`
      })
      
      // Force page refresh after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (clientError) {
      console.log('Client-side failed, trying API method...', clientError)
      
      // Fallback to API method
      try {
        const response = await fetch('/api/auth/assign-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: selectedRole }),
        })

        const data = await response.json()
        console.log('API response:', data)

        if (data.success) {
          setResult({
            type: 'success',
            message: `Role successfully changed to ${selectedRole} using API method. Refreshing in 2 seconds...`
          })
          
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          setResult({
            type: 'error',
            message: `API method failed: ${data.error || 'Unknown error'}`
          })
        }
      } catch (apiError) {
        console.error('Both methods failed:', { clientError, apiError })
        setResult({
          type: 'error',
          message: 'Both client-side and API methods failed. Check console for details.'
        })
      }
    } finally {
      setIsAssigning(false)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p>Please sign in to access this debug page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="w-6 h-6 mr-2" />
            Role Debug & Assignment
          </h1>
          
          {/* Current User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* User Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-3">User Information</h2>
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress}</div>
                <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
              </div>
            </div>

            {/* Role Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Role Information</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Detected Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    role === 'student' ? 'bg-blue-100 text-blue-800' :
                    role === 'teacher' ? 'bg-green-100 text-green-800' :
                    role === 'ngo' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {role || 'None'}
                  </span>
                </div>
                <div><strong>Is Student:</strong> {isStudent ? 'Yes' : 'No'}</div>
                <div><strong>Is Teacher:</strong> {isTeacher ? 'Yes' : 'No'}</div>
                <div><strong>Is NGO:</strong> {isNGO ? 'Yes' : 'No'}</div>
                <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          {/* Raw Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Raw Clerk Metadata</h2>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
              {JSON.stringify({
                publicMetadata: user.publicMetadata,
                privateMetadata: user.privateMetadata,
                unsafeMetadata: user.unsafeMetadata
              }, null, 2)}
            </pre>
          </div>

          {/* Role Assignment */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Assign New Role</h2>
            
            <div className="space-y-3 mb-6">
              {roles.map((roleOption) => (
                <label 
                  key={roleOption.value} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === roleOption.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={selectedRole === roleOption.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === roleOption.value
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === roleOption.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{roleOption.label}</div>
                    <div className="text-sm text-gray-600">{roleOption.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleAssignRole}
              disabled={isAssigning}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                isAssigning
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
              }`}
            >
              {isAssigning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Assigning Role...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Assign Role: {selectedRole}</span>
                </>
              )}
            </button>

            {result && (
              <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                result.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {result.type === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{result.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Check the "Raw Clerk Metadata" section to see if the role is stored correctly</li>
            <li>If the role is missing or wrong, use the role assignment section to fix it</li>
            <li>After assigning a role, refresh the page to see if it worked</li>
            <li>The header should now show the correct role</li>
          </ol>
          <p className="text-xs text-blue-600 mt-3">
            Access this page at: <code>/debug/role</code>
          </p>
        </div>
      </div>
    </div>
  )
}
