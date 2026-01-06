import { ReactNode } from 'react'
import { Card } from './ui/Card'
import { formatNumber } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, icon: Icon, color = 'primary', trend }: StatsCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-800">{displayValue}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </div>
    </Card>
  )
}
