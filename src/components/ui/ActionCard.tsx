import { ReactNode } from 'react'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface ActionCardProps {
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
  title: string
  description: string
  buttonText: string
  buttonColor: string
  buttonHoverColor: string
  onClick: () => void
  children?: ReactNode
  className?: string
}

export default function ActionCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  buttonText,
  buttonColor,
  buttonHoverColor,
  onClick,
  children,
  className = ''
}: ActionCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 ${className}`}>
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mr-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}
      
      <button
        onClick={onClick}
        className={`w-full mt-6 ${buttonColor} text-white py-3 px-6 rounded-lg font-medium ${buttonHoverColor} transition-colors flex items-center justify-center`}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}
