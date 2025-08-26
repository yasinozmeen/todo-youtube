'use client'

import { useCallback } from 'react'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import Layout from '@/components/Layout/Layout'
import TodoForm from '@/components/Todo/TodoForm'
import TodoList from '@/components/Todo/TodoList'
import { useTodos } from '@/hooks/useTodos'
import { useRealtime } from '@/hooks/useRealtime'

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

  // Set up real-time synchronization
  const { isConnected: isRealtimeConnected, error: realtimeError } = useRealtime(
    useCallback((payload: any) => {
      // Real-time updates are handled automatically by the subscription
      // We could add custom logic here if needed (e.g., notifications)
      console.log('Real-time update received:', payload.eventType)
    }, [])
  )

  /**
   * Handle todo toggle (completion status)
   */
  const handleToggleTodo = useCallback(async (id: string) => {
    const result = await toggleTodo(id)
    if (!result.success) {
      console.error('Failed to toggle todo:', result.error)
    }
  }, [toggleTodo])

  /**
   * Handle todo deletion
   */
  const handleDeleteTodo = useCallback(async (id: string) => {
    const result = await deleteTodo(id)
    if (!result.success) {
      console.error('Failed to delete todo:', result.error)
    }
  }, [deleteTodo])

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  return (
    <ProtectedRoute>
      <Layout title="My Todos">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header with Real-time Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Todos
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay organized and get things done
                </p>
              </div>
              
              {/* Real-time Connection Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`
                  w-2 h-2 rounded-full 
                  ${isRealtimeConnected 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-gray-400'
                  }
                `}></div>
                <span className={`
                  ${isRealtimeConnected 
                    ? 'text-green-700' 
                    : 'text-gray-500'
                  }
                `}>
                  {isRealtimeConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Real-time Error Banner */}
            {realtimeError && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg 
                    className="h-4 w-4 text-yellow-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    Real-time sync unavailable: {realtimeError}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Add Todo Form */}
          <div className="mb-8">
            <TodoForm 
              onAddTodo={addTodo}
              isLoading={isLoading}
            />
          </div>

          {/* Todos List */}
          <TodoList
            todos={todos}
            isLoading={isLoading}
            error={error}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />

          {/* Retry Button for Errors */}
          {error && todos.length === 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Footer Stats */}
          {todos.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>
                  {todos.filter(t => !t.completed).length} active, {' '}
                  {todos.filter(t => t.completed).length} completed
                </p>
                <p className="text-xs">
                  Synced across all your devices • {isRealtimeConnected ? 'Real-time' : 'Offline mode'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}