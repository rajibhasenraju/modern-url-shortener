import axios from 'axios'
import type { CreateLinkRequest, CreateLinkResponse, ShortLink } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const authApi = {
  getGoogleAuthUrl: (): string => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'openid email profile'
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&prompt=select_account`
  },

  handleCallback: async (code: string) => {
    const response = await api.get(`/auth/callback?code=${code}`)
    return response.data
  },

  logout: async () => {
    await api.post('/logout')
  },
}

export const linksApi = {
  getAll: async (): Promise<Record<string, ShortLink>> => {
    const response = await api.get('/links')
    return response.data
  },

  create: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    const response = await api.post('/shorten', data)
    return response.data
  },

  delete: async (key: string): Promise<void> => {
    await api.delete(`/links/${key}`)
  },

  getAnalytics: async (key: string) => {
    const response = await api.get(`/links/${key}/analytics`)
    return response.data
  },
}
