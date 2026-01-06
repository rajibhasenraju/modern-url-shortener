export interface ShortLink {
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

export interface Env {
  LINKS: KVNamespace
  USER_URLS: KVNamespace
  SESSIONS: KVNamespace
  ANALYTICS: KVNamespace
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  BASE_URL: string
  ENVIRONMENT: string
}
