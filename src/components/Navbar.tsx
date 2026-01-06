import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Link2 } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">URL Shortener</span>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
