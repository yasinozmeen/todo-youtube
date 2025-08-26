'use client'

import { memo } from 'react'

interface SkeletonLoaderProps {
  variant?: 'todo' | 'text' | 'circle' | 'rectangular'
  count?: number
  className?: string
}

/**
 * SkeletonLoader - Loading placeholder component
 * Features:
 * - Multiple variants (todo, text, circle, rectangular)
 * - Customizable count for multiple items
 * - Smooth pulse animation
 * - Accessible loading state
 */
const SkeletonLoader = memo(({ 
  variant = 'todo',
  count = 1,
  className = '' 
}: SkeletonLoaderProps) => {
  const TodoSkeleton = () => (
    <div className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
      {/* Checkbox */}
      <div className="w-6 h-6 bg-gray-300 rounded-md flex-shrink-0"></div>
      
      {/* Text */}
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      </div>
      
      {/* Delete button placeholder */}
      <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0"></div>
    </div>
  )

  const TextSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
    </div>
  )

  const CircleSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    </div>
  )

  const RectangularSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-20 bg-gray-300 rounded-lg w-full"></div>
    </div>
  )

  const getSkeletonComponent = () => {
    switch (variant) {
      case 'todo':
        return <TodoSkeleton />
      case 'text':
        return <TextSkeleton />
      case 'circle':
        return <CircleSkeleton />
      case 'rectangular':
        return <RectangularSkeleton />
      default:
        return <TodoSkeleton />
    }
  }

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {getSkeletonComponent()}
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  )
})

SkeletonLoader.displayName = 'SkeletonLoader'

export default SkeletonLoader