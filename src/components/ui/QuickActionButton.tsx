import { LucideIcon } from 'lucide-react'

interface QuickActionButtonProps {
  icon: LucideIcon
  iconBgColor: string
  iconHoverColor: string
  iconColor: string
  title: string
  description: string
  onClick: () => void
  className?: string
}

export default function QuickActionButton({
  icon: Icon,
  iconBgColor,
  iconHoverColor,
  iconColor,
  title,
  description,
  onClick,
  className = ''
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-left group ${className}`}
    >
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4 ${iconHoverColor} transition-colors`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </button>
  )
}
