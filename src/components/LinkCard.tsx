import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShortLink } from '@/types'
import { formatDate, copyToClipboard, isExpired, getDaysRemaining } from '@/lib/utils'
import { Copy, ExternalLink, Trash2, BarChart3, QrCode, Clock, Check } from 'lucide-react'

interface LinkCardProps {
  link: ShortLink
  onDelete: () => void
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const shortUrl = `${import.meta.env.VITE_BASE_URL}/${link.key}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(shortUrl)}&size=100x100`
  const expired = isExpired(link.expiry)
  const daysRemaining = getDaysRemaining(link.expiry)

  const handleCopy = async () => {
    await copyToClipboard(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-primary hover:underline truncate"
            >
              /{link.key}
            </a>
            {expired && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                Expired
              </span>
            )}
            {!expired && daysRemaining !== null && daysRemaining <= 7 && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{daysRemaining}d left</span>
              </span>
            )}
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 truncate block text-sm"
          >
            {link.url}
          </a>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{link.views} clicks</span>
            <span>•</span>
            <span>Created {formatDate(link.created)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <img src={qrUrl} alt="QR Code" className="w-16 h-16 border border-gray-200 rounded" />
          
          <button
            onClick={handleCopy}
            className="btn-secondary p-2"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary p-2"
            title="Visit original URL"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => navigate(`/analytics/${link.key}`)}
            className="btn-secondary p-2"
            title="View analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={onDelete}
            className="btn-secondary p-2 hover:bg-red-100 hover:text-red-600"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
