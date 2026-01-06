# 🔗 Modern URL Shortener

> A feature-rich, production-ready URL shortener built with React, TypeScript, Tailwind CSS, and Cloudflare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rajibhasenraju/modern-url-shortener)

## ✨ Features

### Core Features
- 🎯 **Custom Short URLs** - Create branded, memorable short links with custom slugs
- 📊 **Advanced Analytics** - Track clicks, locations, devices, browsers, and referrers
- 🔐 **Google OAuth** - Secure authentication with Google Sign-In
- 📱 **QR Code Generation** - Automatic QR codes for every short link
- ⏰ **Link Expiration** - Set expiration dates for temporary links
- 🔒 **Password Protection** - Optional password protection for sensitive links
- 🏷️ **Tags & Organization** - Categorize links with custom tags

### Modern Features (Similar to Google Dynamic Links)
- 🌍 **Global Edge Network** - Lightning-fast redirects via Cloudflare's CDN
- 📈 **Real-time Analytics** - Live click tracking and statistics
- 🎨 **Beautiful UI** - Modern, responsive interface with Tailwind CSS
- 🔄 **Dynamic Redirects** - Smart routing based on device, location, etc.
- 📊 **Visual Analytics** - Interactive charts with Recharts
- 🚀 **Instant Deploy** - Deploy to Cloudflare Workers in minutes

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **Recharts** - Analytics visualization
- **Lucide React** - Icons

### Backend
- **Cloudflare Workers** - Serverless edge computing
- **Cloudflare KV** - Distributed key-value storage
- **Google OAuth 2.0** - Authentication

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Cloudflare account
- Google Cloud Console project

### 1. Clone the repository

```bash
git clone https://github.com/rajibhasenraju/modern-url-shortener.git
cd modern-url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set authorized redirect URI: `https://your-domain.com/auth/callback`
6. Copy the Client ID and Client Secret

### 4. Set up Cloudflare KV Namespaces

```bash
# Login to Cloudflare
npx wrangler login

# Create KV namespaces
npx wrangler kv:namespace create "LINKS"
npx wrangler kv:namespace create "USER_URLS"
npx wrangler kv:namespace create "SESSIONS"
npx wrangler kv:namespace create "ANALYTICS"

# Create preview namespaces for development
npx wrangler kv:namespace create "LINKS" --preview
npx wrangler kv:namespace create "USER_URLS" --preview
npx wrangler kv:namespace create "SESSIONS" --preview
npx wrangler kv:namespace create "ANALYTICS" --preview
```

### 5. Configure environment variables

**Update `wrangler.toml`:**

```toml
[[kv_namespaces]]
binding = "LINKS"
id = "your-links-namespace-id"
preview_id = "your-links-preview-namespace-id"

[[kv_namespaces]]
binding = "USER_URLS"
id = "your-user-urls-namespace-id"
preview_id = "your-user-urls-preview-namespace-id"

[[kv_namespaces]]
binding = "SESSIONS"
id = "your-sessions-namespace-id"
preview_id = "your-sessions-preview-namespace-id"

[[kv_namespaces]]
binding = "ANALYTICS"
id = "your-analytics-namespace-id"
preview_id = "your-analytics-preview-namespace-id"

[vars]
GOOGLE_CLIENT_ID = "your-google-client-id"
BASE_URL = "https://your-domain.com"
```

**Create `.env` file:**

```env
VITE_API_URL=http://localhost:8787
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_BASE_URL=http://localhost:3000
```

**Create `.dev.vars` file for local development:**

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BASE_URL=http://localhost:3000
```

### 6. Run development servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Cloudflare Worker:**
```bash
npm run dev:worker
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy Frontend (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist
```

### Deploy Worker

```bash
npm run deploy
```

### Set Production Secrets

```bash
echo "your-google-client-secret" | npx wrangler secret put GOOGLE_CLIENT_SECRET
```

## 📖 Usage

### Creating a Short Link

1. Sign in with Google
2. Click "Create Link" button
3. Enter your long URL
4. (Optional) Set custom key, expiration, password, or tags
5. Click "Create Short Link"

### Viewing Analytics

1. Click the analytics icon (📊) on any link
2. View detailed statistics:
   - Total clicks and unique visitors
   - Clicks over time (chart)
   - Geographic distribution
   - Device and browser breakdown

### Managing Links

- **Copy**: Click the copy icon to copy the short URL
- **Visit**: Click the external link icon to visit the original URL
- **Delete**: Click the trash icon to delete a link
- **View QR**: QR codes are displayed automatically on each link card

## 🏗️ Project Structure

```
modern-url-shortener/
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.tsx
│   │   ├── LinkCard.tsx
│   │   └── CreateLinkForm.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   └── NotFound.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── worker/                # Cloudflare Worker
│   └── index.ts           # Worker logic
├── wrangler.toml          # Cloudflare config
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 API Endpoints

### Worker Endpoints

```
POST   /api/shorten         - Create short link
GET    /api/links           - Get user's links
GET    /api/analytics/:key  - Get link analytics
DELETE /api/links/:key      - Delete link
POST   /api/logout          - Logout
GET    /api/me              - Get current user
GET    /auth/callback       - Google OAuth callback
GET    /:key                - Redirect to original URL
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#FF3333',  // Your brand color
    hover: '#000000',
  },
}
```

### Custom Domain

1. Add your domain to Cloudflare
2. Update `BASE_URL` in `wrangler.toml`
3. Update Google OAuth redirect URIs
4. Deploy with `npm run deploy`

## 📊 Analytics Data

 The application tracks:
- Total clicks
- Unique visitors
- Geographic distribution (by country)
- Device types (Mobile/Desktop)
- Browser information
- Referrer sources
- Click timestamps

## 🔐 Security

- **HTTPS Only** - All connections encrypted
- **OAuth 2.0** - Secure authentication
- **Session Management** - 30-day expiring sessions
- **Password Protection** - Optional link passwords
- **Input Validation** - All inputs sanitized

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Rajib Hasen Raju**
- Website: [raju.app](https://raju.app)
- GitHub: [@rajibhasenraju](https://github.com/rajibhasenraju)
- Email: hello@raju.app

## 🙏 Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- UI inspired by modern design patterns
- Analytics powered by Cloudflare's global network

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
