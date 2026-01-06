import { useEffect, useRef } from 'react'
import QRCodeLib from 'qrcode'
import { X, Download } from 'lucide-react'
import { ShortLink } from '../types'

interface Props {
  link: ShortLink
  shortUrl: string
  onClose: () => void
}

const QRCodeModal = ({ link, shortUrl, onClose }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, shortUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    }
  }, [shortUrl])

  const downloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-${link.key}.png`
      a.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">QR Code</h3>
          
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <canvas ref={canvasRef} />
          </div>

          <div className="text-left mb-6">
            <p className="text-sm text-gray-600 mb-1">Short URL:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{shortUrl}</p>
          </div>

          <button onClick={downloadQR} className="btn-primary w-full">
            <span className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download QR Code
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal
