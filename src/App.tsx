import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PublicRedirect from './pages/PublicRedirect'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <LoginPage />} />
        <Route path="/:shortKey" element={<PublicRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
