'use client'

import { useState, useEffect, useCallback } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  connectionType?: string
  effectiveType?: string
}

/**
 * useNetworkStatus Hook - Network connectivity monitoring
 * Features:
 * - Online/offline detection
 * - Slow connection detection
 * - Connection type information
 * - Real-time status updates
 * - Retry mechanism for failed operations
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    connectionType: undefined,
    effectiveType: undefined
  })

  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [isReconnecting, setIsReconnecting] = useState(false)

  /**
   * Update network status based on navigator information
   */
  const updateNetworkStatus = useCallback(() => {
    if (typeof navigator === 'undefined') return

    const connection = (navigator as any).connection 
      || (navigator as any).mozConnection 
      || (navigator as any).webkitConnection

    const isOnline = navigator.onLine
    const isSlowConnection = connection 
      ? ['slow-2g', '2g'].includes(connection.effectiveType)
      : false

    setNetworkStatus(prev => ({
      ...prev,
      isOnline,
      isSlowConnection,
      connectionType: connection?.type,
      effectiveType: connection?.effectiveType
    }))

    // Reset reconnect attempts when back online
    if (isOnline && reconnectAttempts > 0) {
      setReconnectAttempts(0)
      setIsReconnecting(false)
    }
  }, [reconnectAttempts])

  /**
   * Handle online event
   */
  const handleOnline = useCallback(() => {
    updateNetworkStatus()
    setIsReconnecting(false)
    setReconnectAttempts(0)
  }, [updateNetworkStatus])

  /**
   * Handle offline event
   */
  const handleOffline = useCallback(() => {
    updateNetworkStatus()
  }, [updateNetworkStatus])

  /**
   * Handle connection change
   */
  const handleConnectionChange = useCallback(() => {
    updateNetworkStatus()
  }, [updateNetworkStatus])

  /**
   * Attempt to reconnect
   */
  const attemptReconnect = useCallback(async () => {
    if (isReconnecting) return

    setIsReconnecting(true)
    setReconnectAttempts(prev => prev + 1)

    try {
      // Try to fetch a simple resource to test connectivity
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      }).catch(() => {
        // Fallback: try to fetch from a reliable external source
        return fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache',
          mode: 'no-cors'
        })
      })

      clearTimeout(timeoutId)
      
      if (response) {
        // Connection successful
        setNetworkStatus(prev => ({ ...prev, isOnline: true }))
        setIsReconnecting(false)
        setReconnectAttempts(0)
        return true
      }
    } catch (error) {
      // Connection failed
      console.log('Reconnection attempt failed:', error)
    }

    setIsReconnecting(false)
    return false
  }, [isReconnecting])

  /**
   * Auto-retry with exponential backoff
   */
  const autoRetry = useCallback(() => {
    if (networkStatus.isOnline || isReconnecting || reconnectAttempts >= 5) {
      return
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 16000)
    
    setTimeout(() => {
      attemptReconnect()
    }, delay)
  }, [networkStatus.isOnline, isReconnecting, reconnectAttempts, attemptReconnect])

  /**
   * Setup event listeners
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial status check
    updateNetworkStatus()

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Connection change listener (if supported)
    const connection = (navigator as any).connection 
      || (navigator as any).mozConnection 
      || (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [handleOnline, handleOffline, handleConnectionChange, updateNetworkStatus])

  /**
   * Auto-retry when offline
   */
  useEffect(() => {
    if (!networkStatus.isOnline) {
      autoRetry()
    }
  }, [networkStatus.isOnline, autoRetry])

  /**
   * Check if request should be retried based on error
   */
  const shouldRetry = useCallback((error: any): boolean => {
    if (!error) return false

    // Network-related errors
    const networkErrors = [
      'Failed to fetch',
      'NetworkError',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED',
      'TIMEOUT'
    ]

    const errorMessage = error.message || error.toString()
    return networkErrors.some(netError => 
      errorMessage.includes(netError)
    )
  }, [])

  /**
   * Retry a failed operation
   */
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        // Don't retry if not a network error
        if (!shouldRetry(error)) {
          throw error
        }

        // Don't delay on last attempt
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
        }
      }
    }

    throw lastError
  }, [shouldRetry])

  return {
    ...networkStatus,
    reconnectAttempts,
    isReconnecting,
    attemptReconnect,
    shouldRetry,
    retryOperation
  }
}