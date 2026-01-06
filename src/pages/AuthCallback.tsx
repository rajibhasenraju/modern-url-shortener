import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser, setSessionToken } = useAuthStore()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // The actual OAuth flow is handled by the Cloudflare Worker
      // This component just shows a loading state while the cookie is being set
      const checkAuth = async () => {
        // Wait a bit for the cookie to be set by the worker
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if session cookie exists
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('session='))
        
        if (sessionCookie) {
          const session = sessionCookie.split('=')[1]
          setSessionToken(session)
          
          // Extract email from session or make an API call
          // For now, we'll just set a basic user object
          setUser({ email: 'user@example.com' })
          navigate('/')
        } else {
          navigate('/login')
        }
      }
      
      checkAuth()
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, setUser, setSessionToken])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Signing you in...</h2>
        <p className="text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}

export default AuthCallback
