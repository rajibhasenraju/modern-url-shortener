import { useState } from 'react'
import { CreateLinkRequest } from '@/types'
import { validateUrl } from '@/lib/utils'
import { X, Link, Hash, Clock, Lock } from 'lucide-react'

interface CreateLinkFormProps {
  onSubmit: (data: CreateLinkRequest) => void
  onCancel: () => void
  isLoading: boolean
  error?: string
}

export default function CreateLinkForm({ onSubmit, onCancel, isLoading, error }: CreateLinkFormProps) {
  const [url, setUrl] = useState('')
  const [customKey, setCustomKey] = useState('')
  const [expiryDays, setExpiryDays] = useState('')
  const [password, setPassword] = useState('')
  const [urlError, setUrlError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError('')

    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL')
      return
    }

    const data: CreateLinkRequest = {
      url,
      customKey: customKey || undefined,
      expiryDays: expiryDays ? parseInt(expiryDays) : undefined,
      password: password || undefined,
    }

    onSubmit(data)
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Create New Short Link</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Link className="w-4 h-4 inline mr-1" />
            Destination URL *
          </label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/your-long-url"
            className="input"
            required
          />
          {urlError && <p className="text-red-600 text-sm mt-1">{urlError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Hash className="w-4 h-4 inline mr-1" />
              Custom Key (optional)
            </label>
            <input
              type="text"
              value={customKey}
              onChange={e => setCustomKey(e.target.value)}
              placeholder="my-link"
              pattern="[a-zA-Z0-9_-]+"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Expiry (days)
            </label>
            <input
              type="number"
              value={expiryDays}
              onChange={e => setExpiryDays(e.target.value)}
              placeholder="30"
              min="1"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline mr-1" />
              Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? 'Creating...' : 'Create Short Link'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
