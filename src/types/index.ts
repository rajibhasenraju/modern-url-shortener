export interface User {
  email: string
  name?: string
  avatar?: string
}

export interface ShortLink {
  key: string
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  customDomain?: string
  title?: string
  description?: string
  image?: string
  tags?: string[]
  analytics?: LinkAnalytics
}

export interface LinkAnalytics {
  totalClicks: number
  uniqueClicks: number
  clicksByDate: Record<string, number>
  clicksByCountry: Record<string, number>
  clicksByDevice: Record<string, number>
  clicksByBrowser: Record<string, number>
  clicksByReferrer: Record<string, number>
}

export interface CreateLinkRequest {
  url: string
  customKey?: string
  expiry?: number
  title?: string
  description?: string
  tags?: string[]
}

export interface CreateLinkResponse {
  shortKey: string
  shortUrl: string
  error?: string
}

export interface AnalyticsData {
  date: string
  clicks: number
  uniqueClicks: number
}
