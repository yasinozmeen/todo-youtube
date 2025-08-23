'use client'

import { memo } from 'react'
import type { OptimisticTodo } from '@/types/todo'

interface TodoListProps {
  todos: OptimisticTodo[]
  isLoading: boolean
  error: string | null
  onToggleTodo: (id: string) => void
  onDeleteTodo?: (id: string) => void
  className?: string
}

/**
 * TodoItem Component - Individual todo item with completion toggle
 */
const TodoItem = memo(({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: OptimisticTodo
  onToggle: (id: string) => void
  onDelete?: (id: string) => void
}) => {
  const isOptimistic = todo.isOptimistic
  const isLoading = todo.isLoading

  return (
    <div 
      className={`
        group flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200
        transition-all duration-200 ease-in-out
        hover:border-gray-300 hover:shadow-sm
        ${isOptimistic ? 'opacity-70' : ''}
        ${isLoading ? 'animate-pulse' : ''}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        disabled={isLoading}
        className={`
          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${todo.completed
            ? 'bg-green-500 border-green-500 hover:bg-green-600'
            : 'border-gray-300 hover:border-green-500'
          }
        `}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg 
            className="w-3 h-3 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </button>

      {/* Todo Text */}
      <div className="flex-1 min-w-0">
        <p 
          className={`
            text-sm sm:text-base break-words transition-all duration-200
            ${todo.completed 
              ? 'text-gray-500 line-through' 
              : 'text-gray-900'
            }
          `}
        >
          {todo.text}
        </p>
        
        {/* Optimistic indicator */}
        {isOptimistic && (
          <p className="text-xs text-blue-500 mt-1">
            Saving...
          </p>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex-shrink-0">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Delete Button (if provided) */}
      {onDelete && (
        <button
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
          className={`
            flex-shrink-0 p-1.5 rounded-md text-gray-400
            opacity-0 group-hover:opacity-100 transition-all duration-200
            hover:text-red-500 hover:bg-red-50
            focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:opacity-100
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
          aria-label="Delete todo"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      )}
    </div>
  )
})

TodoItem.displayName = 'TodoItem'

/**
 * TodoList Component - Displays list of todos with loading and error states
 * Features:
 * - Optimistic UI updates
 * - Loading states
 * - Error handling
 * - Empty state
 * - Real-time updates
 * - Mobile responsive
 */
export default function TodoList({ 
  todos, 
  isLoading, 
  error, 
  onToggleTodo, 
  onDeleteTodo,
  className = '' 
}: TodoListProps) {
  // Loading state
  if (isLoading && todos.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index}
            className="animate-pulse flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error && todos.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <svg 
                className="h-6 w-6 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-red-800 mb-1">
              Failed to load todos
            </h3>
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No todos yet
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Get started by adding your first task above. Stay organized and productive!
          </p>
        </div>
      </div>
    )
  }

  // Todo list
  return (
    <div className={`${className}`}>
      {/* Error banner (if there's an error but we have cached todos) */}
      {error && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg 
              className="h-4 w-4 text-yellow-600 flex-shrink-0" 
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
              Connection issue: {error}
            </p>
          </div>
        </div>
      )}

      {/* Todo Items */}
      <div className="space-y-2 sm:space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          {todos.filter(t => t.completed).length} of {todos.length} completed
        </p>
      </div>
    </div>
  )
}