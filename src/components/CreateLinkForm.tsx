import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link2, Sparkles, Calendar, Tag } from 'lucide-react'
import { api } from '../lib/api'
import { CreateLinkRequest } from '../types'
import { toast } from '../lib/toast'

interface Props {
  onSuccess: () => void
}

const CreateLinkForm = ({ onSuccess }: Props) => {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const createMutation = useMutation({
    mutationFn: (data: CreateLinkRequest) => api.createLink(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Link created: ${data.shortUrl}`)
        setUrl('')
        setCustomAlias('')
        setExpiryDays('')
        setShowAdvanced(false)
        onSuccess()
      } else {
        toast.error(data.error || 'Failed to create link')
      }
    },
    onError: () => {
      toast.error('Failed to create link')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    createMutation.mutate({
      url,
      customAlias: customAlias || undefined,
      expiryDays: expiryDays ? parseInt(expiryDays) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Long URL *
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="input-field pl-11"
            required
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg animate-slide-up">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Alias (optional)
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                pattern="[a-zA-Z0-9_-]+"
                className="input-field pl-11"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only letters, numbers, hyphens, and underscores
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry (days)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                placeholder="30"
                min="1"
                max="365"
                className="input-field pl-11"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="btn-primary flex-1"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Short Link'}
        </button>
        
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-secondary"
        >
          {showAdvanced ? 'Less' : 'More'} Options
        </button>
      </div>
    </form>
  )
}

export default CreateLinkForm
