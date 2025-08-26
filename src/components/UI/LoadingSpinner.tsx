'use client'

import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  className?: string
  label?: string
}

/**
 * LoadingSpinner - Reusable loading spinner component
 * Features:
 * - Multiple sizes (sm, md, lg, xl)
 * - Multiple color variants
 * - Accessible with aria-label
 * - Smooth animation
 */
const LoadingSpinner = memo(({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  label = 'Loading...'
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent', 
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-2 rounded-full animate-spin
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner