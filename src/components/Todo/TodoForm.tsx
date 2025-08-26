'use client'

import { useState, useRef, useCallback } from 'react'
import type { CreateTodoData, TodoOperationResult } from '@/types/todo'

interface TodoFormProps {
  onAddTodo: (data: CreateTodoData) => Promise<TodoOperationResult>
  isLoading?: boolean
  className?: string
}

/**
 * TodoForm Component - Input form for creating new todos
 * Features:
 * - Enter key and button submission
 * - Input validation with user-friendly errors
 * - Loading states with visual feedback
 * - Auto-focus and input clearing
 * - Responsive design for mobile and desktop
 */
export default function TodoForm({ onAddTodo, isLoading = false, className = '' }: TodoFormProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Validate input text
   */
  const validateInput = (value: string): string | null => {
    const trimmed = value.trim()
    if (!trimmed) {
      return 'Please enter a task'
    }
    if (trimmed.length > 500) {
      return 'Task is too long (max 500 characters)'
    }
    return null
  }

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (inputText: string) => {
    // Validate input
    const validationError = validateInput(inputText)
    if (validationError) {
      setError(validationError)
      inputRef.current?.focus()
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Add todo
      const result = await onAddTodo({ text: inputText.trim() })
      
      if (result.success) {
        // Clear input and focus for next todo
        setText('')
        setError(null)
        inputRef.current?.focus()
      } else {
        // Show error and keep input value
        setError(result.error || 'Failed to add todo')
        inputRef.current?.focus()
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo'
      setError(errorMessage)
      inputRef.current?.focus()
      
    } finally {
      setIsSubmitting(false)
    }
  }, [onAddTodo])

  /**
   * Handle Enter key press
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault()
      handleSubmit(text)
    }
    
    // Clear error when user starts typing
    if (error && text !== e.currentTarget.value) {
      setError(null)
    }
  }, [text, isSubmitting, handleSubmit, error])

  /**
   * Handle button click
   */
  const handleButtonClick = useCallback(() => {
    if (!isSubmitting) {
      handleSubmit(text)
    }
  }, [text, isSubmitting, handleSubmit])

  /**
   * Handle input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setText(newValue)
    
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }, [error])

  const shouldShowLoading = isLoading || isSubmitting

  return (
    <div className={`w-full ${className}`}>
      {/* Input Form - Reference Design Match */}
      <div className="flex gap-4">
        {/* Text Input - Reference Design */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add new task"
            disabled={shouldShowLoading}
            className={`
              w-full px-4 py-4 text-base font-medium
              bg-white border-b-2 border-gray-300 focus:border-gray-400
              placeholder-gray-400 text-gray-700
              transition-all duration-200 ease-in-out
              focus:outline-none 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error 
                ? 'border-b-red-400 focus:border-b-red-500 bg-red-50' 
                : 'focus:border-b-gray-500'
              }
              ${shouldShowLoading ? 'pr-10' : ''}
            `}
            maxLength={500}
            autoComplete="off"
            autoFocus
            aria-label="Add new task"
            aria-describedby={error ? 'todo-form-error' : undefined}
            aria-invalid={!!error}
            role="textbox"
          />
          
          {/* Input loading spinner */}
          {shouldShowLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Add Button - Reference Design Circular + */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={shouldShowLoading}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-gray-400/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${shouldShowLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white hover:shadow-lg transform hover:scale-105 active:scale-95'
            }
          `}
          aria-label="Add todo"
        >
          {shouldShowLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <svg 
              className="h-6 w-6 font-bold" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          id="todo-form-error"
          className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-in fade-in duration-200"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="h-4 w-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </div>
      )}

      {/* Character Counter (for long text) */}
      {text.length > 400 && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {text.length}/500 characters
        </div>
      )}
    </div>
  )
}