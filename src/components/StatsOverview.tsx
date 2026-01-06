import { Link2, Eye, MousePointerClick, TrendingUp } from 'lucide-react'
import { ShortLink } from '../types'
import { formatNumber } from '../lib/utils'

interface Props {
  links: ShortLink[]
}

const StatsOverview = ({ links }: Props) => {
  const totalLinks = links.length
  const totalViews = links.reduce((sum, link) => sum + (link.views || 0), 0)
  const activeLinks = links.filter(link => !link.expiry || Date.now() < link.expiry).length
  const avgViews = totalLinks > 0 ? Math.round(totalViews / totalLinks) : 0

  const stats = [
    {
      label: 'Total Links',
      value: formatNumber(totalLinks),
      icon: Link2,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Views',
      value: formatNumber(totalViews),
      icon: Eye,
      color: 'bg-green-500',
    },
    {
      label: 'Active Links',
      value: formatNumber(activeLinks),
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Avg Views',
      value: formatNumber(avgViews),
      icon: MousePointerClick,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsOverview
