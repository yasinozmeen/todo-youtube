'use client'

import { useCallback, useEffect } from 'react'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import Layout from '@/components/Layout/Layout'
import TodoForm from '@/components/Todo/TodoForm'
import TodoList from '@/components/Todo/TodoList'
import { ToastContainer } from '@/components/UI/Toast'
import { useTodos } from '@/hooks/useTodos'
import { useRealtime } from '@/hooks/useRealtime'
import { useToast } from '@/hooks/useToast'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

/**
 * TodosPage - Main todo application page
 * Features:
 * - Real-time todo creation with optimistic updates
 * - Multi-tab synchronization
 * - Comprehensive error handling
 * - Mobile-responsive design
 * - Accessibility compliant
 */
export default function TodosPage() {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refetch
  } = useTodos()

  // Toast notifications
  const { toasts, removeToast, error: showError, success: showSuccess, offline, online } = useToast()

  // Network status monitoring
  const { isOnline, isSlowConnection, isReconnecting } = useNetworkStatus()

  // Set up real-time synchronization
  const { isConnected: isRealtimeConnected, error: realtimeError } = useRealtime(
    useCallback((payload: any) => {
      // Real-time updates are handled automatically by the subscription
      console.log('Real-time update received:', payload.eventType)
      
      // Show success notification for external updates
      if (payload.eventType === 'INSERT' && payload.new) {
        showSuccess('New todo synced from another device')
      }
    }, [showSuccess])
  )

  // Handle network status changes - only show offline toast
  useEffect(() => {
    if (!isOnline) {
      offline()
    } 
    // Don't show online toast immediately to avoid loops
  }, [isOnline, offline])

  /**
   * Handle todo toggle (completion status) with enhanced error handling
   */
  const handleToggleTodo = useCallback(async (id: string) => {
    const result = await toggleTodo(id)
    if (!result.success) {
      console.error('Failed to toggle todo:', result.error)
      
      // Show user-friendly error message for specific scenarios
      if (result.error?.includes('wait for the current operation')) {
        // Rapid clicking detected - this is handled gracefully, no need for intrusive error
        return
      }
      
      // Show error toast for network/database errors
      showError('Failed to update todo. Please try again.')
    }
  }, [toggleTodo, showError])

  /**
   * Handle todo deletion with enhanced error handling
   */
  const handleDeleteTodo = useCallback(async (id: string) => {
    const result = await deleteTodo(id)
    if (!result.success) {
      console.error('Failed to delete todo:', result.error)
      
      // Show error toast for network/database errors
      showError('Failed to delete todo. Please try again.')
    } else {
      // Show success message for successful deletion
      showSuccess('Todo deleted successfully')
    }
  }, [deleteTodo, showError, showSuccess])

  /**
   * Handle delete retry for specific todo
   */
  const handleRetryDelete = useCallback(async (id: string) => {
    // Retry the delete operation
    await handleDeleteTodo(id)
  }, [handleDeleteTodo])

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  return (
    <ProtectedRoute>
      <Layout title="Your To Do" showHeader={true} showUserInfo={true}>
        {/* Main Container - Reference Design Match */}
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Header Title - Reference Design */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
                Your To Do
              </h1>
            </div>

            {/* Network Status Indicator */}
            {(!isOnline || realtimeError) && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      {!isOnline ? 'You\'re offline' : 'Connection issue'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {!isOnline 
                        ? 'Changes will sync when reconnected'
                        : 'Real-time sync temporarily unavailable'
                      }
                    </p>
                    {isReconnecting && (
                      <p className="text-xs text-yellow-700 mt-1">
                        Attempting to reconnect...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Slow Connection Warning */}
            {isOnline && isSlowConnection && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-800">
                    Slow connection detected. Some features may be delayed.
                  </p>
                </div>
              </div>
            )}

            {/* Add Todo Form - Reference Design */}
            <div className="mb-6">
              <TodoForm 
                onAddTodo={addTodo}
                isLoading={isLoading}
              />
            </div>

            {/* Todos List - Reference Design */}
            <TodoList
              todos={todos}
              isLoading={isLoading}
              error={error}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />

            {/* Error Retry */}
            {error && todos.length === 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer 
          toasts={toasts} 
          onClose={removeToast}
          position="top-right"
        />
      </Layout>
    </ProtectedRoute>
  )
}