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

interface ShortLink {
  url: string
  created: number
  user: string
  views: number
  expiry?: number
  customKey?: boolean
  clicks?: ClickData[]
}

interface ClickData {
  timestamp: number
  country?: string
  city?: string
  device?: string
  browser?: string
  referrer?: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

function generateRandomString(len = 6): string {
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
    cookies[name] = decodeURIComponent(rest.join('='))
  })
  return cookies
}

async function getUserFromSession(request: Request, env: Env): Promise<string | null> {
  const cookies = parseCookies(request.headers.get('Cookie'))
  const sessionToken = cookies['session']
  if (sessionToken) {
    return await env.SESSIONS.get(sessionToken)
  }
  return null
}

function getDeviceInfo(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile'
  if (/tablet/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Other'
}

async function trackClick(
  env: Env,
  key: string,
  request: Request
): Promise<void> {
  const clickData: ClickData = {
    timestamp: Date.now(),
    country: request.cf?.country as string,
    city: request.cf?.city as string,
    device: getDeviceInfo(request.headers.get('User-Agent') || ''),
    browser: getBrowser(request.headers.get('User-Agent') || ''),
    referrer: request.headers.get('Referer') || undefined,
  }

  // Store in analytics KV
  const analyticsKey = `clicks:${key}:${Date.now()}`
  await env.ANALYTICS.put(analyticsKey, JSON.stringify(clickData))
}

async function shortenURL(
  env: Env,
  userId: string,
  longUrl: string,
  customKey?: string,
  expiry?: number
): Promise<{ shortKey?: string; error?: string }> {
  const key = customKey || generateRandomString()
  const exists = await env.LINKS.get(key)

  if (exists && !customKey) {
    return shortenURL(env, userId, longUrl, undefined, expiry)
  }
  if (exists && customKey) {
    return { error: 'Custom key already taken' }
  }

  const metadata: ShortLink = {
    url: longUrl,
    created: Date.now(),
    user: userId,
    views: 0,
    customKey: !!customKey,
  }
  if (expiry) metadata.expiry = expiry

  await env.LINKS.put(key, JSON.stringify(metadata))

  // Update user's links
  let userUrls = await env.USER_URLS.get(userId)
  const userUrlsData = userUrls ? JSON.parse(userUrls) : {}
  userUrlsData[key] = metadata
  await env.USER_URLS.put(userId, JSON.stringify(userUrlsData))

  return { shortKey: key }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    // OAuth callback
    if (path === '/auth/callback') {
      const code = url.searchParams.get('code')
      if (!code) {
        return new Response('No code provided', { status: 400 })
      }

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${env.BASE_URL}/auth/callback`,
          grant_type: 'authorization_code',
        }),
      })

      const tokenData = await tokenResp.json() as any
      const idToken = tokenData.id_token
      const [, payloadBase64] = idToken.split('.')
      const payload = JSON.parse(atob(payloadBase64))
      const email = payload.email

      const session = generateRandomString(32)
      await env.SESSIONS.put(session, email, { expirationTtl: 86400 * 30 })

      return new Response(
        `<script>document.cookie='session=${session}; path=/; max-age=2592000';window.location='/'</script>`,
        { headers: { 'Content-Type': 'text/html', ...CORS_HEADERS } }
      )
    }

    // Logout
    if (path === '/logout') {
      return new Response(
        `<script>document.cookie='session=; path=/; max-age=0';window.location='/login'</script>`,
        { headers: { 'Content-Type': 'text/html', ...CORS_HEADERS } }
      )
    }

    // API: Get user's links
    if (path === '/api/links' && request.method === 'GET') {
      const userId = await getUserFromSession(request, env)
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
      }

      const userUrls = await env.USER_URLS.get(userId)
      return new Response(userUrls || '{}', {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // API: Create short link
    if (path === '/api/shorten' && request.method === 'POST') {
      const userId = await getUserFromSession(request, env)
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
      }

      const formData = await request.formData()
      const longUrl = formData.get('url') as string
      const custom = formData.get('custom') as string | null
      const expiryDays = formData.get('expiry')
      const expiry = expiryDays
        ? Date.now() + parseInt(expiryDays as string) * 86400000
        : undefined

      if (custom && !/^[a-zA-Z0-9_-]+$/.test(custom)) {
        return new Response(
          JSON.stringify({ error: 'Invalid custom key format' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
        )
      }

      const result = await shortenURL(env, userId, longUrl, custom || undefined, expiry)
      
      if (result.error) {
        return new Response(JSON.stringify(result), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          shortKey: result.shortKey,
          fullUrl: `${env.BASE_URL}/${result.shortKey}`,
        }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }

    // API: Delete link
    if (path.startsWith('/api/links/') && request.method === 'DELETE') {
      const userId = await getUserFromSession(request, env)
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
      }

      const key = path.split('/')[3]
      await env.LINKS.delete(key)

      const userUrls = await env.USER_URLS.get(userId)
      if (userUrls) {
        const data = JSON.parse(userUrls)
        delete data[key]
        await env.USER_URLS.put(userId, JSON.stringify(data))
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // Redirect short links
    const key = path.slice(1)
    if (key) {
      const record = await env.LINKS.get(key)
      if (record) {
        const meta: ShortLink = JSON.parse(record)
        
        // Check expiry
        if (meta.expiry && Date.now() > meta.expiry) {
          await env.LINKS.delete(key)
          return new Response('Link expired', {
            status: 410,
            headers: CORS_HEADERS,
          })
        }

        // Track click
        meta.views = (meta.views || 0) + 1
        await env.LINKS.put(key, JSON.stringify(meta))
        
        // Track analytics
        ctx.waitUntil(trackClick(env, key, request))

        return Response.redirect(meta.url, 302)
      }
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS })
  },
}
