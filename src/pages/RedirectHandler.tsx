import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'

function RedirectHandler() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [error, setError] = useState(false)

  useEffect(() => {
    // The redirect is handled by the Cloudflare Worker
    // This component is just a fallback if JavaScript routing catches it first
    if (shortCode) {
      // Force a full page reload to let the worker handle it
      window.location.href = `/${shortCode}`
    } else {
      setError(true)
    }
  }, [shortCode])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h2>
          <p className="text-gray-600 mb-6">The short link you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary inline-block">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Redirecting...</h2>
      </div>
    </div>
  )
}

export default RedirectHandler
