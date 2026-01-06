# Deployment Guide

## Step-by-Step Cloudflare Workers Deployment

### 1. Prerequisites

- Cloudflare account (free tier works)
- Wrangler CLI installed: `npm install -g wrangler`
- Google OAuth credentials configured

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespaces

**Production:**
```bash
wrangler kv:namespace create "LINKS"
wrangler kv:namespace create "USER_URLS"
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "ANALYTICS"
```

**Preview (for testing):**
```bash
wrangler kv:namespace create "LINKS" --preview
wrangler kv:namespace create "USER_URLS" --preview
wrangler kv:namespace create "SESSIONS" --preview
wrangler kv:namespace create "ANALYTICS" --preview
```

Output example:
```
🌀 Creating namespace with title "modern-url-shortener-LINKS"
✨ Success!
Add the following to your wrangler.toml:
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### 4. Update wrangler.toml

Replace the namespace IDs:

```toml
[[kv_namespaces]]
binding = "LINKS"
id = "your-production-id"
preview_id = "your-preview-id"

[[kv_namespaces]]
binding = "USER_URLS"
id = "your-production-id"
preview_id = "your-preview-id"

# ... repeat for SESSIONS and ANALYTICS
```

### 5. Set Environment Variables

Update `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"
BASE_URL = "https://go.mybd.shop"  # Your custom domain
THEME_COLOR = "#FF3333"
THEME_HOVER = "#000000"
```

### 6. Set Secrets

```bash
wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Google OAuth client secret when prompted
```

### 7. Build Frontend

```bash
npm run build
```

This creates optimized production files in `dist/`

### 8. Deploy

```bash
npm run deploy
# or
wrangler deploy
```

Output:
```
Deploying modern-url-shortener...
✨ Success! Deployed to:
https://modern-url-shortener.your-subdomain.workers.dev
```

### 9. Add Custom Domain

1. **In Cloudflare Dashboard:**
   - Go to Workers & Pages
   - Click your worker
   - Go to Settings → Triggers
   - Click "Add Custom Domain"
   - Enter: `go.mybd.shop`

2. **Update OAuth Redirect URIs** in Google Cloud Console:
   - Add `https://go.mybd.shop/auth/callback`

3. **Update frontend environment:**
   ```env
   VITE_BASE_URL=https://go.mybd.shop
   ```

4. **Rebuild and redeploy:**
   ```bash
   npm run build
   npm run deploy
   ```

### 10. Verify Deployment

1. Visit your domain: `https://go.mybd.shop`
2. Test login with Google
3. Create a short link
4. Test the redirect
5. Check analytics

## Custom Domain Setup (Detailed)

### If domain is on Cloudflare:

1. Domain automatically configured
2. SSL certificate auto-provisioned
3. Ready in ~1 minute

### If domain is external:

1. **Add CNAME record** in your DNS provider:
   ```
   go.mybd.shop CNAME modern-url-shortener.your-subdomain.workers.dev
   ```

2. **Wait for DNS propagation** (up to 24 hours)

3. **Enable SSL** in Cloudflare if domain is proxied

## Environment-Specific Configuration

### Development
```bash
# .env.development
VITE_API_URL=http://localhost:8787
VITE_BASE_URL=http://localhost:3000
```

### Production
```bash
# .env.production
VITE_API_URL=https://go.mybd.shop
VITE_BASE_URL=https://go.mybd.shop
```

## Troubleshooting

### "Error: KV namespace not found"
- Verify namespace IDs in `wrangler.toml`
- Ensure namespaces are created: `wrangler kv:namespace list`

### "OAuth error: redirect_uri_mismatch"
- Check redirect URIs in Google Cloud Console
- Ensure they match your deployed domain

### "Worker exceeded CPU time limit"
- Review worker code for infinite loops
- Check KV read/write efficiency
- Consider using `ctx.waitUntil()` for non-critical tasks

### "CORS errors"
- Verify CORS headers in worker
- Check if API URL matches in frontend

## Monitoring

### Cloudflare Dashboard

1. **Analytics** → View requests, errors, CPU time
2. **Logs** → Real-time worker logs (requires Workers Paid plan)
3. **KV** → Monitor storage usage

### Enable Tail Logs (development)

```bash
wrangler tail
```

See real-time logs from your worker.

## Scaling

### Free Tier Limits:
- 100,000 requests/day
- 1 GB KV storage
- 10ms CPU time per request

### Paid Plan ($5/month):
- 10M requests/month included
- Unlimited KV storage (pay per GB)
- 50ms CPU time per request
- Real-time logs
- Analytics retention

## Backup

### Export KV Data

```bash
# Export links
wrangler kv:key list --binding=LINKS > backup-links.json

# Export user URLs
wrangler kv:key list --binding=USER_URLS > backup-users.json
```

### Import KV Data

```bash
wrangler kv:bulk put --binding=LINKS backup-links.json
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

Add `CF_API_TOKEN` to GitHub repository secrets.

---

**Need help?** Open an issue on GitHub or contact hello@raju.app
