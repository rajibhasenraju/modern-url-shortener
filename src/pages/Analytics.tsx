import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLinkAnalytics } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { ArrowLeft, TrendingUp, Users, Globe, Monitor } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FFE6E6']

export default function Analytics() {
  const { key } = useParams<{ key: string }>()
  const navigate = useNavigate()

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', key],
    queryFn: () => getLinkAnalytics(key!),
    enabled: !!key,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center">
            <h2 className="text-xl font-semibold">Analytics not available</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary inline-flex items-center space-x-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics for /{key}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalClicks}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.uniqueClicks}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Countries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.clicksByCountry.length}</p>
              </div>
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Devices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.clicksByDevice.length}</p>
              </div>
              <Monitor className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.clicksByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#FF3333" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Clicks by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.clicksByCountry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {analytics.clicksByCountry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
