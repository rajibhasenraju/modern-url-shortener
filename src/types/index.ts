export interface ShortLink {
  key: string
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  customKey?: boolean
  clicks?: ClickData[]
}

export interface ClickData {
  timestamp: number
  country?: string
  city?: string
  device?: string
  browser?: string
  referrer?: string
}

export interface User {
  email: string
  sessionToken?: string
}

export interface CreateLinkRequest {
  url: string
  customKey?: string
  expiryDays?: number
}

export interface CreateLinkResponse {
  success: boolean
  shortKey?: string
  error?: string
  fullUrl?: string
}

export interface DashboardStats {
  totalLinks: number
  totalClicks: number
  activeLinks: number
  clicksToday: number
}

export interface AnalyticsData {
  dailyClicks: { date: string; clicks: number }[]
  topLinks: { key: string; url: string; clicks: number }[]
  deviceBreakdown: { device: string; count: number }[]
  countryBreakdown: { country: string; count: number }[]
}
