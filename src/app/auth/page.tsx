'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AuthForm from '@/components/Auth/AuthForm'
import Layout from '@/components/Layout/Layout'

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
      } else {
        router.push('/todos')
      }
    }
  }, [isAuthenticated, isLoading, router])

  const handleAuthSuccess = () => {
    // Check if there's a redirect path stored
    const redirectPath = sessionStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    } else {
      router.push('/todos')
    }
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </Layout>
  )
}