import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  iconColor: string
  borderColor: string
  value: string | number
  label: string
  className?: string
}

export default function StatsCard({
  icon: Icon,
  iconColor,
  borderColor,
  value,
  label,
  className = ''
}: StatsCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border ${borderColor} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
    </div>
  )
}
