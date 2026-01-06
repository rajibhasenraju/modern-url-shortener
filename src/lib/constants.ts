export const THEME_COLOR = import.meta.env.VITE_THEME_COLOR || '#FF3333'
export const THEME_HOVER = import.meta.env.VITE_THEME_HOVER || '#000000'
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://go.mybd.shop'

export const LINK_EXPIRY_OPTIONS = [
  { label: 'Never', value: undefined },
  { label: '1 Day', value: 1 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
]

export const CHART_COLORS = {
  primary: THEME_COLOR,
  secondary: '#8884d8',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
}
