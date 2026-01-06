import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, TrendingUp, Link as LinkIcon, MousePointerClick } from 'lucide-react'
import { linksApi } from '@/lib/api'
import CreateLinkModal from '@/components/CreateLinkModal'
import LinkCard from '@/components/LinkCard'
import StatsCard from '@/components/StatsCard'
import type { ShortLink } from '@/types'

function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: linksApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: linksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const linksArray = links ? Object.entries(links).map(([key, link]) => ({ ...link, key })) : []
  const totalLinks = linksArray.length
  const totalClicks = linksArray.reduce((sum, link) => sum + (link.views || 0), 0)
  const activeLinks = linksArray.filter(link => !link.expiry || link.expiry > Date.now()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track your short links</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Short Link
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Links"
          value={totalLinks}
          icon={LinkIcon}
          color="blue"
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicks}
          icon={MousePointerClick}
          color="green"
        />
        <StatsCard
          title="Active Links"
          value={activeLinks}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Links List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
          <span className="text-sm text-gray-500">{totalLinks} total</span>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your links...</p>
          </div>
        ) : linksArray.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-6">Create your first short link to get started</p>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
              Create Link
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {linksArray.map(link => (
              <LinkCard
                key={link.key}
                link={link}
                onDelete={() => deleteMutation.mutate(link.key)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard
