import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CreateLinkForm from '../components/CreateLinkForm'
import LinksList from '../components/LinksList'
import StatsOverview from '../components/StatsOverview'
import { api } from '../lib/api'
import { ShortLink } from '../types'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: links, isLoading, refetch } = useQuery<ShortLink[]>({
    queryKey: ['links'],
    queryFn: api.getLinks,
  })

  const filteredLinks = links?.filter(link => 
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.key.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Stats Overview */}
      <StatsOverview links={links || []} />
      
      {/* Create Link Form */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Create Short Link</h2>
        <CreateLinkForm onSuccess={refetch} />
      </div>

      {/* Search and Links List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Links</h2>
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <LinksList links={filteredLinks} onUpdate={refetch} />
        )}
      </div>
    </div>
  )
}

export default Dashboard
