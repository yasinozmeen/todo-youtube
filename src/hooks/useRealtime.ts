'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useAuth } from '@/contexts/AuthContext'
import { todoService } from '@/lib/todoService'
import type { Todo, UseRealtimeReturn, TodoRealtimePayload } from '@/types/todo'

/**
 * Custom hook for real-time todo synchronization across multiple tabs/devices
 * Handles Supabase real-time subscriptions with proper cleanup and error handling
 */
export function useRealtime(onTodoChange?: (payload: TodoRealtimePayload) => void): UseRealtimeReturn {
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Handle real-time events from Supabase
   */
  const handleRealtimeEvent = useCallback((payload: any) => {
    try {
      console.log('Real-time event received:', payload)
      
      const { eventType, new: newRecord, old: oldRecord } = payload
      
      // Map database record to application Todo type
      const mapRecord = (record: any): Todo | undefined => {
        if (!record) return undefined
        return {
          id: record.id,
          user_id: record.user_id,
          text: record.title, // Map 'title' to 'text'
          completed: record.completed,
          created_at: record.created_at,
          updated_at: record.updated_at
        }
      }

      const realtimePayload: TodoRealtimePayload = {
        eventType: eventType as any,
        new: newRecord ? mapRecord(newRecord) as any : undefined,
        old: oldRecord ? mapRecord(oldRecord) as any : undefined
      }

      // Call the callback if provided
      if (onTodoChange) {
        onTodoChange(realtimePayload)
      }

      setError(null) // Clear any previous errors on successful event
      
    } catch (err) {
      console.error('Error handling real-time event:', err)
      setError('Failed to process real-time update')
    }
  }, [onTodoChange])

  /**
   * Set up real-time subscription
   */
  const setupSubscription = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      return
    }

    try {
      console.log('Setting up real-time subscription for user:', user.id)
      
      // Clean up existing subscription
      if (subscriptionRef.current) {
        await subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }

      // Create new subscription
      const subscription = todoService.subscribeToTodos(user.id, handleRealtimeEvent)
      subscriptionRef.current = subscription

      // Set up subscription status handlers
      subscription
        .on('subscribe', (status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('Real-time subscription established')
            setIsConnected(true)
            setError(null)
          } else {
            console.error('Subscription failed:', err)
            setIsConnected(false)
            setError('Failed to establish real-time connection')
          }
        })
        .on('error', (err) => {
          console.error('Real-time subscription error:', err)
          setIsConnected(false)
          setError('Real-time connection error')
          
          // Attempt to reconnect after delay
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect real-time subscription...')
            setupSubscription()
          }, 3000) // Retry after 3 seconds
        })

    } catch (err) {
      console.error('Error setting up real-time subscription:', err)
      setIsConnected(false)
      setError('Failed to set up real-time connection')
    }
  }, [user?.id, isAuthenticated, handleRealtimeEvent])

  /**
   * Clean up subscription
   */
  const cleanupSubscription = useCallback(async () => {
    if (subscriptionRef.current) {
      console.log('Cleaning up real-time subscription')
      await subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  // Set up subscription when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setupSubscription()
    } else {
      cleanupSubscription()
    }

    return () => {
      cleanupSubscription()
    }
  }, [isAuthenticated, user?.id, setupSubscription, cleanupSubscription])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSubscription()
    }
  }, [cleanupSubscription])

  return {
    isConnected,
    error
  }
}

/**
 * Enhanced hook that combines useTodos with real-time synchronization
 * Automatically updates local state when real-time events are received
 */
export function useTodosWithRealtime() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  /**
   * Handle real-time todo changes
   */
  const handleTodoChange = useCallback((payload: TodoRealtimePayload) => {
    const { eventType, new: newTodo, old: oldTodo } = payload

    setTodos(current => {
      switch (eventType) {
        case 'INSERT':
          if (newTodo && !current.find(todo => todo.id === newTodo.id)) {
            // Add new todo to the beginning of the list (newest first)
            return [newTodo, ...current]
          }
          return current

        case 'UPDATE':
          if (newTodo) {
            return current.map(todo => 
              todo.id === newTodo.id ? newTodo : todo
            )
          }
          return current

        case 'DELETE':
          if (oldTodo) {
            return current.filter(todo => todo.id !== oldTodo.id)
          }
          return current

        default:
          return current
      }
    })

    setLastSyncTime(new Date())
  }, [])

  const realtime = useRealtime(handleTodoChange)

  return {
    todos,
    setTodos,
    lastSyncTime,
    ...realtime
  }
}