type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  duration?: number
}

class Toast {
  private container: HTMLDivElement | null = null

  private getContainer(): HTMLDivElement {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2'
      document.body.appendChild(this.container)
    }
    return this.container
  }

  private show(message: string, type: ToastType, options: ToastOptions = {}) {
    const container = this.getContainer()
    const toast = document.createElement('div')
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }

    toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up max-w-md`
    toast.textContent = message
    
    container.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(-10px)'
      toast.style.transition = 'all 0.3s ease-out'
      
      setTimeout(() => {
        container.removeChild(toast)
        if (container.children.length === 0 && this.container) {
          document.body.removeChild(this.container)
          this.container = null
        }
      }, 300)
    }, options.duration || 3000)
  }

  success(message: string, options?: ToastOptions) {
    this.show(message, 'success', options)
  }

  error(message: string, options?: ToastOptions) {
    this.show(message, 'error', options)
  }

  info(message: string, options?: ToastOptions) {
    this.show(message, 'info', options)
  }
}

export const toast = new Toast()
