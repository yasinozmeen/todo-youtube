'use client'

import { useState, useCallback, useRef } from 'react'
import type { ToastMessage, ToastType } from '@/components/UI/Toast'

/**
 * useToast Hook - Toast notification management
 * Features:
 * - Add/remove toasts
 * - Auto-dismiss with configurable duration
 * - Multiple toast types (success, error, warning, info)
 * - Action buttons
 * - Prevent duplicate toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const toastIdRef = useRef(0)

  /**
   * Generate unique toast ID
   */
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${++toastIdRef.current}`
  }, [])

  /**
   * Add a new toast
   */
  const addToast = useCallback((
    message: string,
    type: ToastType = 'info',
    options?: {
      title?: string
      duration?: number
      action?: {
        label: string
        onClick: () => void
      }
      preventDuplicate?: boolean
    }
  ) => {
    // Check for duplicate if requested
    if (options?.preventDuplicate) {
      const duplicate = toasts.find(toast => 
        toast.message === message && toast.type === type
      )
      if (duplicate) {
        return duplicate.id
      }
    }

    const id = generateId()
    const newToast: ToastMessage = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? (type === 'error' ? 7000 : 5000), // Errors stay longer
      action: options?.action
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [toasts, generateId])

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  /**
   * Convenience methods for different toast types
   */
  const success = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'success', options)
  }, [addToast])

  const error = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'error', options)
  }, [addToast])

  const warning = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'warning', options)
  }, [addToast])

  const info = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'info', options)
  }, [addToast])

  /**
   * Toast for network errors with retry action
   */
  const networkError = useCallback((
    message: string = 'Network error occurred',
    retryAction?: () => void
  ) => {
    return error(message, {
      title: 'Connection Error',
      duration: 0, // Don't auto-dismiss network errors
      action: retryAction ? {
        label: 'Retry',
        onClick: retryAction
      } : undefined,
      preventDuplicate: true
    })
  }, [error])

  /**
   * Toast for offline status
   */
  const offline = useCallback(() => {
    return warning('You\'re offline. Changes will sync when reconnected.', {
      title: 'Offline Mode',
      duration: 0, // Stay until connection is restored
      preventDuplicate: true
    })
  }, [warning])

  /**
   * Toast for connection restored
   */
  const online = useCallback(() => {
    // First remove any offline toasts
    setToasts(prev => prev.filter(toast => 
      !(toast.type === 'warning' && toast.message.includes('offline'))
    ))
    
    const id = generateId()
    const newToast: ToastMessage = {
      id,
      type: 'success',
      message: 'Connection restored. Syncing changes...',
      duration: 3000
    }
    
    // Check for duplicate
    const duplicate = toasts.find(toast => 
      toast.message === newToast.message && toast.type === newToast.type
    )
    if (!duplicate) {
      setToasts(prev => [...prev, newToast])
    }
    
    return id
  }, [setToasts, generateId, toasts])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    // Convenience methods
    success,
    error, 
    warning,
    info,
    // Network-specific methods
    networkError,
    offline,
    online
  }
}