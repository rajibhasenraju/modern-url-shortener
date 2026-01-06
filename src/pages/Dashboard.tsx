import { useState } from 'react'
import { Link2, TrendingUp, MousePointerClick, LogOut } from 'lucide-react'
import { LinkForm } from '@/components/LinkForm'
import { LinkCard } from '@/components/LinkCard'
import { StatsCard } from '@/components/StatsCard'
import { Button } from '@/components/ui/Button'
import { useLinks } from '@/hooks/useLinks'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { DashboardStats } from '@/types'

export function Dashboard() {
  const { data: links, isLoading } = useLinks()
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    window.location.href = '/'
  }

  const stats: DashboardStats = {
    totalLinks: Object.keys(links || {}).length,
    totalClicks: Object.values(links || {}).reduce((sum, link) => sum + link.views, 0),
    activeLinks: Object.values(links || {}).filter(link => !link.expiry || link.expiry > Date.now()).length,
    clicksToday: 0, // Calculate from analytics
  }

  const filteredLinks = Object.entries(links || {}).filter(([key, link]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">URL Shortener</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Links" value={stats.totalLinks} icon={Link2} />
          <StatsCard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} />
          <StatsCard title="Active Links" value={stats.activeLinks} icon={TrendingUp} />
          <StatsCard title="Clicks Today" value={stats.clicksToday} icon={TrendingUp} />
        </div>

        {/* Link Form */}
        <div className="mb-8">
          <LinkForm />
        </div>

        {/* Links List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Links</h2>
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-600">Loading your links...</p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'No links found' : 'No links yet. Create your first short link!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map(([key, link]) => (
                <LinkCard key={key} shortKey={key} link={link} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
