'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  showUserInfo?: boolean
  className?: string
}

export default function Header({ 
  title = 'Todo App', 
  showUserInfo = true,
  className = '' 
}: HeaderProps) {
  const { user, signOut, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className={`bg-white shadow-sm border-b border-gray-100 ${className}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-800">
              {title}
            </h1>
          </div>

          {/* User Info & Actions */}
          {isAuthenticated && showUserInfo && (
            <div className="flex items-center space-x-3">
              {/* User Email */}
              {user?.email && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {user.email}
                  </span>
                </div>
              )}

              {/* Mobile User Icon */}
              <div className="sm:hidden w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <svg 
                  className="sm:hidden w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}