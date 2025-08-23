'use client'

import React from 'react'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showHeader?: boolean
  showUserInfo?: boolean
  className?: string
}

export default function Layout({ 
  children, 
  title,
  showHeader = true,
  showUserInfo = true,
  className = '' 
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showHeader && (
        <Header 
          title={title} 
          showUserInfo={showUserInfo}
        />
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}