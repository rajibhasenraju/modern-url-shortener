export interface ShortLink {
  key: string
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  customAlias?: string
  tags?: string[]
  lastAccessed?: number
}

export interface AnalyticsData {
  date: string
  clicks: number
  uniqueClicks: number
}

export interface LinkAnalytics {
  totalClicks: number
  uniqueVisitors: number
  devices: { name: string; count: number }[]
  countries: { name: string; count: number }[]
  referrers: { name: string; count: number }[]
  clicksByDay: AnalyticsData[]
}

export interface CreateLinkRequest {
  url: string
  customAlias?: string
  expiryDays?: number
  tags?: string[]
}

export interface CreateLinkResponse {
  success: boolean
  shortKey?: string
  error?: string
  shortUrl?: string
}
