export interface ShortLink {
  key: string
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  customDomain?: string
  tags?: string[]
  password?: string
}

export interface LinkMetadata extends ShortLink {
  qrCode?: string
  shortUrl: string
}

export interface User {
  email: string
  name?: string
  picture?: string
}

export interface AnalyticsData {
  totalClicks: number
  uniqueClicks: number
  clicksByDate: { date: string; clicks: number }[]
  clicksByCountry: { country: string; clicks: number }[]
  clicksByDevice: { device: string; clicks: number }[]
  clicksByBrowser: { browser: string; clicks: number }[]
}

export interface CreateLinkRequest {
  url: string
  customKey?: string
  expiryDays?: number
  tags?: string[]
  password?: string
}

export interface CreateLinkResponse {
  success: boolean
  shortKey?: string
  shortUrl?: string
  error?: string
}
