interface Env {
  LINKS: KVNamespace
  USER_URLS: KVNamespace
  SESSIONS: KVNamespace
  ANALYTICS: KVNamespace
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  BASE_URL: string
  ENVIRONMENT: string
}

interface LinkMetadata {
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  password?: string
  tags?: string[]
}

interface AnalyticsEvent {
  timestamp: number
  country?: string
  device?: string
  browser?: string
  referrer?: string
}

function generateRandomString(len: number = 6): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let result = ''
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader?.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=')
    if (name) cookies[name] = decodeURIComponent(rest.join('='))
  })
  return cookies
}

async function getUserIdFromSession(request: Request, env: Env): Promise<string | null> {
  const cookies = parseCookies(request.headers.get('Cookie'))
  const sessionToken = cookies['session']
  if (sessionToken) {
    return await env.SESSIONS.get(sessionToken)
  }
  return null
}

async function handleGoogleCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (!code) {
    return new Response('Authorization code not found', { status: 400 })
  }

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${env.BASE_URL}/auth/callback`,
      grant_type: 'authorization_code',
    }),
  })

  const tokenJson: any = await tokenResp.json()
  const id_token = tokenJson.id_token
  const [, payloadBase64] = id_token.split('.')
  const payload = JSON.parse(atob(payloadBase64))
  const email = payload.email

  const session = generateRandomString(32)
  await env.SESSIONS.put(session, email, { expirationTtl: 86400 * 30 }) // 30 days

  return new Response(
    `<html><body><script>document.cookie='session=${session}; path=/; max-age=${86400 * 30}';window.location.href='/'</script></body></html>`,
    { headers: { 'content-type': 'text/html' } }
  )
}

async function handleCreateLink(request: Request, env: Env): Promise<Response> {
  const userId = await getUserIdFromSession(request, env)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body: any = await request.json()
  const { url, customKey, expiryDays, password, tags } = body

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL required' }), { status: 400 })
  }

  const key = customKey || generateRandomString()
  const exists = await env.LINKS.get(key)
  
  if (exists) {
    if (customKey) {
      return new Response(JSON.stringify({ error: 'Custom key already taken' }), { status: 409 })
    }
    return handleCreateLink(request, env) // Try again with new random key
  }

  const metadata: LinkMetadata = {
    url,
    created: Date.now(),
    user: userId,
    views: 0,
    ...(expiryDays && { expiry: Date.now() + expiryDays * 86400000 }),
    ...(password && { password }),
    ...(tags && { tags }),
  }

  await env.LINKS.put(key, JSON.stringify(metadata))

  let userUrls = await env.USER_URLS.get(userId)
  const userUrlsObj = userUrls ? JSON.parse(userUrls) : {}
  userUrlsObj[key] = metadata
  await env.USER_URLS.put(userId, JSON.stringify(userUrlsObj))

  return new Response(
    JSON.stringify({
      success: true,
      shortKey: key,
      shortUrl: `${env.BASE_URL}/${key}`,
    }),
    { headers: { 'content-type': 'application/json' } }
  )
}

async function handleGetLinks(request: Request, env: Env): Promise<Response> {
  const userId = await getUserIdFromSession(request, env)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const userUrls = await env.USER_URLS.get(userId)
  const links = userUrls ? Object.values(JSON.parse(userUrls)) : []

  return new Response(JSON.stringify(links), {
    headers: { 'content-type': 'application/json' },
  })
}

async function handleRedirect(key: string, request: Request, env: Env): Promise<Response> {
  const record = await env.LINKS.get(key)
  
  if (!record) {
    return new Response('Link not found', { status: 404 })
  }

  const meta: LinkMetadata = JSON.parse(record)

  if (meta.expiry && Date.now() > meta.expiry) {
    await env.LINKS.delete(key)
    return new Response('Link expired', { status: 410 })
  }

  // Track analytics
  const cf = (request as any).cf
  const analyticsEvent: AnalyticsEvent = {
    timestamp: Date.now(),
    country: cf?.country,
    device: request.headers.get('user-agent')?.includes('Mobile') ? 'Mobile' : 'Desktop',
    browser: request.headers.get('user-agent')?.split(' ').pop(),
    referrer: request.headers.get('referer') || undefined,
  }

  const analyticsKey = `analytics:${key}`
  const existingAnalytics = await env.ANALYTICS.get(analyticsKey)
  const events = existingAnalytics ? JSON.parse(existingAnalytics) : []
  events.push(analyticsEvent)
  await env.ANALYTICS.put(analyticsKey, JSON.stringify(events))

  // Update view count
  meta.views++
  await env.LINKS.put(key, JSON.stringify(meta))

  return Response.redirect(meta.url, 302)
}

async function handleGetAnalytics(key: string, request: Request, env: Env): Promise<Response> {
  const userId = await getUserIdFromSession(request, env)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const analyticsKey = `analytics:${key}`
  const data = await env.ANALYTICS.get(analyticsKey)
  const events: AnalyticsEvent[] = data ? JSON.parse(data) : []

  const analytics = {
    totalClicks: events.length,
    uniqueClicks: new Set(events.map(e => e.country + e.device)).size,
    clicksByDate: aggregateByDate(events),
    clicksByCountry: aggregateByField(events, 'country'),
    clicksByDevice: aggregateByField(events, 'device'),
    clicksByBrowser: aggregateByField(events, 'browser'),
  }

  return new Response(JSON.stringify(analytics), {
    headers: { 'content-type': 'application/json' },
  })
}

function aggregateByDate(events: AnalyticsEvent[]) {
  const byDate: Record<string, number> = {}
  events.forEach(e => {
    const date = new Date(e.timestamp).toISOString().split('T')[0]
    byDate[date] = (byDate[date] || 0) + 1
  })
  return Object.entries(byDate).map(([date, clicks]) => ({ date, clicks }))
}

function aggregateByField(events: AnalyticsEvent[], field: keyof AnalyticsEvent) {
  const byField: Record<string, number> = {}
  events.forEach(e => {
    const value = String(e[field] || 'Unknown')
    byField[value] = (byField[value] || 0) + 1
  })
  return Object.entries(byField).map(([key, clicks]) => ({ [field]: key, clicks }))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Auth endpoints
    if (path === '/auth/callback') {
      return handleGoogleCallback(request, env)
    }

    // API endpoints
    if (path === '/api/shorten' && request.method === 'POST') {
      const response = await handleCreateLink(request, env)
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v))
      return response
    }

    if (path === '/api/links' && request.method === 'GET') {
      const response = await handleGetLinks(request, env)
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v))
      return response
    }

    if (path.startsWith('/api/analytics/')) {
      const key = path.split('/api/analytics/')[1]
      const response = await handleGetAnalytics(key, request, env)
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v))
      return response
    }

    if (path === '/api/logout' && request.method === 'POST') {
      return new Response(null, {
        headers: {
          'Set-Cookie': 'session=; path=/; max-age=0',
          ...corsHeaders,
        },
      })
    }

    if (path === '/api/me') {
      const userId = await getUserIdFromSession(request, env)
      if (userId) {
        return new Response(JSON.stringify({ email: userId }), {
          headers: { 'content-type': 'application/json', ...corsHeaders },
        })
      }
      return new Response(null, { status: 401, headers: corsHeaders })
    }

    // Short link redirect
    if (path.length > 1 && !path.startsWith('/api')) {
      const key = path.slice(1)
      return handleRedirect(key, request, env)
    }

    return new Response('Not Found', { status: 404 })
  },
}
