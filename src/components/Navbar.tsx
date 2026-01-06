import { Link2, LogOut, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ShortLink</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
