import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  sessionToken: string | null
  setUser: (user: User | null) => void
  setSessionToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(n  persist(
    set => ({
      user: null,
      sessionToken: null,
      setUser: user => set({ user }),
      setSessionToken: token => set({ sessionToken: token }),
      logout: () => {
        set({ user: null, sessionToken: null })
        document.cookie = 'session=; Max-Age=0; path=/'
        window.location.href = '/login'
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
