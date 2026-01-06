import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md p-6',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}
