import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-green-800">
            Join EcoLearning
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start your environmental sustainability journey today
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-sm normal-case',
                card: 'shadow-lg',
                headerTitle: 'text-green-800',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-green-500 focus:ring-green-500',
                footerActionLink: 'text-green-600 hover:text-green-700'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
