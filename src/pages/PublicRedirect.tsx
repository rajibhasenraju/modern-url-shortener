import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const PublicRedirect = () => {
  const { shortKey } = useParams()
  const [redirecting, setRedirecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // The actual redirect is handled by the Cloudflare Worker
    // This component only shows if JavaScript redirect is needed
    const timer = setTimeout(() => {
      setRedirecting(false)
      setError('Link not found or expired')
    }, 2000)

    return () => clearTimeout(timer)
  }, [shortKey])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/" className="btn-primary inline-block">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you</p>
      </div>
    </div>
  )
}

export default PublicRedirect
