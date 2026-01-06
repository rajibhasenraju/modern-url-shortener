import { useState } from 'react'
import { Link2, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useCreateLink } from '@/hooks/useLinks'
import { isValidUrl, validateCustomKey } from '@/lib/utils'
import { LINK_EXPIRY_OPTIONS } from '@/lib/constants'

export function LinkForm() {
  const [url, setUrl] = useState('')
  const [customKey, setCustomKey] = useState('')
  const [expiryDays, setExpiryDays] = useState<number | undefined>()
  const [errors, setErrors] = useState<{ url?: string; customKey?: string }>({})

  const { mutate: createLink, isPending } = useCreateLink()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: typeof errors = {}
    if (!url || !isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL'
    }
    if (customKey) {
      const validation = validateCustomKey(customKey)
      if (!validation.valid) {
        newErrors.customKey = validation.error
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createLink(
      { url, customKey: customKey || undefined, expiryDays },
      {
        onSuccess: () => {
          setUrl('')
          setCustomKey('')
          setExpiryDays(undefined)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link2 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-800">Create Short Link</h2>
      </div>

      <div className="space-y-4">
        <Input
          type="url"
          label="Long URL"
          placeholder="https://example.com/very-long-url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          error={errors.url}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Custom Key (optional)"
            placeholder="my-link"
            value={customKey}
            onChange={e => setCustomKey(e.target.value)}
            error={errors.customKey}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry
            </label>
            <select
              value={expiryDays}
              onChange={e => setExpiryDays(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              {LINK_EXPIRY_OPTIONS.map(option => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isPending}>
          <Sparkles className="w-4 h-4 mr-2" />
          Shorten URL
        </Button>
      </div>
    </form>
  )
}
