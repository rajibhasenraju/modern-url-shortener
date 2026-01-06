import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import RedirectHandler from './pages/RedirectHandler'
import AuthCallback from './pages/AuthCallback'
import Layout from './components/Layout'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/"
        element={
          user ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/:shortCode" element={<RedirectHandler />} />
    </Routes>
  )
}

export default App
