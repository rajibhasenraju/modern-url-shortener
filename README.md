# 🔗 Modern URL Shortener

> A feature-rich URL shortening service built with React, TypeScript, Tailwind CSS, and deployed on Cloudflare Workers. Includes analytics, QR codes, custom domains, and more!

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rajibhasenraju/modern-url-shortener)

## ✨ Features

- 🚀 **Modern Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- ⚡ **Blazing Fast**: Deployed on Cloudflare Workers Edge Network
- 🔐 **Secure Authentication**: Google OAuth 2.0 integration
- 📊 **Analytics Dashboard**: Track clicks, locations, devices, and browsers
- 🎨 **QR Code Generation**: Instant QR codes for all short links
- 🔗 **Custom Short URLs**: Create branded, memorable links
- ⏱️ **Link Expiration**: Set automatic expiry for temporary links
- 🌍 **Global CDN**: Fast link redirects worldwide
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 🎯 **Type-Safe**: End-to-end TypeScript for reliability

## 📸 Screenshots

### Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

### Analytics
![Analytics Preview](https://via.placeholder.com/800x400?text=Analytics+Preview)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Routing
- **Lucide React** - Icons
- **Recharts** - Analytics charts
- **QRCode** - QR code generation

### Backend
- **Cloudflare Workers** - Serverless edge computing
- **Cloudflare KV** - Distributed key-value storage
- **Google OAuth 2.0** - Authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajibhasenraju/modern-url-shortener.git
   cd modern-url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:8787
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_BASE_URL=http://localhost:3000
   ```

4. **Create KV Namespaces**
   ```bash
   # Create production namespaces
   wrangler kv:namespace create "LINKS"
   wrangler kv:namespace create "USER_URLS"
   wrangler kv:namespace create "SESSIONS"
   wrangler kv:namespace create "ANALYTICS"
   
   # Create preview namespaces
   wrangler kv:namespace create "LINKS" --preview
   wrangler kv:namespace create "USER_URLS" --preview
   wrangler kv:namespace create "SESSIONS" --preview
   wrangler kv:namespace create "ANALYTICS" --preview
   ```

5. **Update wrangler.toml**
   
   Replace the namespace IDs in `wrangler.toml` with the IDs from step 4.

6. **Set up Google OAuth**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)

7. **Run development server**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Worker
   npm run dev:worker
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Cloudflare Workers

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Configure wrangler.toml**
   
   Update production values:
   ```toml
   [vars]
   GOOGLE_CLIENT_ID = "your-production-client-id"
   BASE_URL = "https://go.mybd.shop"
   ```

3. **Set secrets**
   ```bash
   wrangler secret put GOOGLE_CLIENT_SECRET
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Custom Domain Setup

1. Add your domain in Cloudflare Dashboard
2. Go to Workers & Pages → your worker → Settings → Triggers
3. Add custom domain
4. Update `BASE_URL` in `wrangler.toml`

## 📁 Project Structure

```
modern-url-shortener/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── LinkForm.tsx
│   │   ├── LinkCard.tsx
│   │   └── StatsCard.tsx
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── worker/              # Cloudflare Worker
│   ├── index.ts         # Worker entry point
│   └── types.ts         # Worker types
├── public/              # Static assets
├── wrangler.toml        # Worker configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8787
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_BASE_URL=http://localhost:3000
VITE_THEME_COLOR=#FF3333
VITE_THEME_HOVER=#000000
```

**Worker (wrangler.toml)**
```toml
[vars]
GOOGLE_CLIENT_ID = "your-client-id"
BASE_URL = "https://go.mybd.shop"
THEME_COLOR = "#FF3333"
```

### Secrets (via Wrangler)
```bash
wrangler secret put GOOGLE_CLIENT_SECRET
```

## 📊 Analytics

The platform tracks:
- **Total clicks** per link
- **Geographic data** (country, city)
- **Device types** (mobile, tablet, desktop)
- **Browsers** (Chrome, Firefox, Safari, etc.)
- **Referrers** (where clicks came from)
- **Time-series data** for trend analysis

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#FF3333',  // Your brand color
        hover: '#000000',
      },
    },
  },
}
```

### Custom Domain

Update `BASE_URL` in:
- `.env` (development)
- `wrangler.toml` (production)

## 🧪 Development

### Scripts

```bash
npm run dev          # Start Vite dev server
npm run dev:worker   # Start Wrangler dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to Cloudflare
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Quality

- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type checking

Run before committing:
```bash
npm run lint
npm run format
```

## 🔐 Security

- OAuth 2.0 authentication via Google
- Session tokens stored in KV with TTL
- CORS properly configured
- Input validation on all endpoints
- Rate limiting (via Cloudflare)

## 📈 Performance

- **Edge deployment** - Global low latency
- **KV storage** - Distributed, fast reads
- **React Query** - Optimistic updates, caching
- **Code splitting** - Faster initial load
- **Lazy loading** - Components loaded on demand

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## 📞 Support

For issues and questions:
- 🐛 [GitHub Issues](https://github.com/rajibhasenraju/modern-url-shortener/issues)
- 📧 Email: hello@raju.app

---

**Built with ❤️ by [Rajib Hasen Raju](https://raju.app)**
