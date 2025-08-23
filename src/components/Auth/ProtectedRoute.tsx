'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth', 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path for redirect after login
      const currentPath = window.location.pathname
      if (currentPath !== '/' && currentPath !== '/auth') {
        sessionStorage.setItem('redirectAfterLogin', currentPath)
      }
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}

// Higher-order component for protected pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string
    fallback?: React.ReactNode
  }
) {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute 
      redirectTo={options?.redirectTo} 
      fallback={options?.fallback}
    >
      <Component {...props} />
    </ProtectedRoute>
  )

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return WrappedComponent
}