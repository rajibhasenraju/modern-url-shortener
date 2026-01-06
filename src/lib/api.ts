import axios from 'axios'
import { CreateLinkRequest, CreateLinkResponse, ShortLink, AnalyticsData } from '@/types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export async function createShortLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
  const response = await api.post<CreateLinkResponse>('/shorten', data)
  return response.data
}

export async function getUserLinks(): Promise<ShortLink[]> {
  const response = await api.get<ShortLink[]>('/links')
  return response.data
}

export async function deleteLink(key: string): Promise<void> {
  await api.delete(`/links/${key}`)
}

export async function updateLink(key: string, data: Partial<ShortLink>): Promise<void> {
  await api.put(`/links/${key}`, data)
}

export async function getLinkAnalytics(key: string): Promise<AnalyticsData> {
  const response = await api.get<AnalyticsData>(`/analytics/${key}`)
  return response.data
}

export async function generateQRCode(url: string): Promise<string> {
  const response = await api.post<{ qrCode: string }>('/qr', { url })
  return response.data.qrCode
}
