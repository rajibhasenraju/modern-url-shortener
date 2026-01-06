import axios from 'axios'
import { CreateLinkRequest, CreateLinkResponse, ShortLink } from '../types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
})

export const api = {
  async getLinks(): Promise<ShortLink[]> {
    const response = await apiClient.get('/api/links')
    return response.data.links || []
  },

  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    const response = await apiClient.post('/api/links', data)
    return response.data
  },

  async deleteLink(key: string): Promise<void> {
    await apiClient.delete(`/api/links/${key}`)
  },

  async getLinkAnalytics(key: string) {
    const response = await apiClient.get(`/api/links/${key}/analytics`)
    return response.data
  },
}
