import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import useToastStore from '@/hooks/useToast'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-up',
        colors[type]
      )}
    >
      {icons[type]}
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
