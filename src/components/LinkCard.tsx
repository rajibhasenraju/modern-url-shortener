import { useState } from 'react'
import { Copy, QrCode, Trash2, ExternalLink, TrendingUp, Calendar } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { copyToClipboard, formatDate, formatNumber, generateQRCode } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import { useDeleteLink } from '@/hooks/useLinks'
import { BASE_URL } from '@/lib/constants'
import type { ShortLink } from '@/types'

interface LinkCardProps {
  shortKey: string
  link: ShortLink
}

export function LinkCard({ shortKey, link }: LinkCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const { mutate: deleteLink } = useDeleteLink()

  const fullUrl = `${BASE_URL}/${shortKey}`

  const handleCopy = async () => {
    await copyToClipboard(fullUrl)
    toast.success('Link copied to clipboard!')
  }

  const handleShowQR = async () => {
    if (!qrCode) {
      const code = await generateQRCode(fullUrl)
      setQrCode(code)
    }
    setShowQR(!showQR)
  }

  const isExpired = link.expiry && Date.now() > link.expiry

  return (
    <Card hover className="relative">
      {isExpired && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
          Expired
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">{shortKey}</h3>
            {link.customKey && (
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
                Custom
              </span>
            )}
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 break-all"
          >
            {link.url}
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{formatNumber(link.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(link.created)}</span>
          </div>
        </div>

        {showQR && qrCode && (
          <div className="flex justify-center pt-4 border-t">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleCopy} variant="secondary" size="sm" className="flex-1">
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button onClick={handleShowQR} variant="secondary" size="sm" className="flex-1">
            <QrCode className="w-4 h-4 mr-1" />
            QR
          </Button>
          <Button
            onClick={() => deleteLink(shortKey)}
            variant="danger"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-gray-50 rounded px-3 py-2 flex items-center justify-between">
          <code className="text-sm text-gray-700 font-mono">{fullUrl}</code>
        </div>
      </div>
    </Card>
  )
}
