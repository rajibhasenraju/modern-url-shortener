import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserLinks, createShortLink, deleteLink } from '@/lib/api'
import { CreateLinkRequest } from '@/types'
import Navbar from '@/components/Navbar'
import LinkCard from '@/components/LinkCard'
import CreateLinkForm from '@/components/CreateLinkForm'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['links'],
    queryFn: getUserLinks,
    enabled: isAuthenticated,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateLinkRequest) => createShortLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      setShowCreateForm(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (key: string) => deleteLink(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  if (isLoading || linksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Links</h1>
            <p className="text-gray-600 mt-1">
              {links?.length || 0} short {links?.length === 1 ? 'link' : 'links'} created
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Link</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateLinkForm
              onSubmit={data => createMutation.mutate(data)}
              onCancel={() => setShowCreateForm(false)}
              isLoading={createMutation.isPending}
              error={createMutation.error?.message}
            />
          </div>
        )}

        {!links || links.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-6">Create your first short link to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Link</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map(link => (
              <LinkCard
                key={link.key}
                link={link}
                onDelete={() => deleteMutation.mutate(link.key)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
