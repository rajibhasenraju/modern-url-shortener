/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_BASE_URL: string
  readonly VITE_THEME_COLOR: string
  readonly VITE_THEME_HOVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
