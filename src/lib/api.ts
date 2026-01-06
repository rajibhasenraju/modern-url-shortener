import axios from 'axios'
import type { CreateLinkRequest, CreateLinkResponse, ShortLink, AnalyticsData } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const linkApi = {
  createLink: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    const formData = new FormData()
    formData.append('url', data.url)
    if (data.customKey) formData.append('custom', data.customKey)
    if (data.expiryDays) formData.append('expiry', data.expiryDays.toString())

    const response = await api.post<CreateLinkResponse>('/shorten', formData)
    return response.data
  },

  getLinks: async (): Promise<Record<string, ShortLink>> => {
    const response = await api.get<Record<string, ShortLink>>('/links')
    return response.data
  },

  deleteLink: async (key: string): Promise<void> => {
    await api.delete(`/links/${key}`)
  },

  getAnalytics: async (key?: string): Promise<AnalyticsData> => {
    const url = key ? `/analytics/${key}` : '/analytics'
    const response = await api.get<AnalyticsData>(url)
    return response.data
  },
}

export const authApi = {
  logout: async (): Promise<void> => {
    await api.get('/logout')
  },

  getAuthUrl: (): string => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${import.meta.env.VITE_BASE_URL}/auth/callback`
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email&prompt=select_account`
  },
}

export default api
