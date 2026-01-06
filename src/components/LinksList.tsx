import { useState } from 'react'
import { Copy, QrCode, Trash2, ExternalLink, Calendar, Eye } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { ShortLink } from '../types'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import QRCodeModal from './QRCodeModal'
import { formatDate, formatNumber } from '../lib/utils'

interface Props {
  links: ShortLink[]
  onUpdate: () => void
}

const LinksList = ({ links, onUpdate }: Props) => {
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null)
  const baseUrl = import.meta.env.VITE_BASE_URL

  const deleteMutation = useMutation({
    mutationFn: (key: string) => api.deleteLink(key),
    onSuccess: () => {
      toast.success('Link deleted successfully')
      onUpdate()
    },
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No links yet. Create your first short link above!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {links.map((link) => {
          const shortUrl = `${baseUrl}/${link.key}`
          const isExpired = link.expiry && Date.now() > link.expiry

          return (
            <div
              key={link.key}
              className={`border rounded-lg p-4 hover:border-primary transition-colors ${
                isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-primary">{link.key}</span>
                    {isExpired && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Expired
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 mb-2 truncate"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{link.url}</span>
                  </a>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(link.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created {formatDate(link.created)}
                    </span>
                    {link.expiry && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expires {formatDate(link.expiry)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedLink(link)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Show QR code"
                  >
                    <QrCode className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => deleteMutation.mutate(link.key)}
                    disabled={deleteMutation.isPending}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedLink && (
        <QRCodeModal
          link={selectedLink}
          shortUrl={`${baseUrl}/${selectedLink.key}`}
          onClose={() => setSelectedLink(null)}
        />
      )}
    </>
  )
}

export default LinksList
