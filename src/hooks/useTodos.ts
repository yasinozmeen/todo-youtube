'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { todoService } from '@/lib/todoService'
import type { 
  Todo, 
  CreateTodoData, 
  OptimisticTodo, 
  UseTodosReturn,
  TodoOperationResult
} from '@/types/todo'

/**
 * Custom hook for managing todos with real-time updates and optimistic UI
 * Provides CRUD operations with loading states and error handling
 */
export function useTodos(): UseTodosReturn {
  const { user, isAuthenticated } = useAuth()
  const [todos, setTodos] = useState<OptimisticTodo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Using real authentication - no mock user needed

  /**
   * Fetch todos from database
   */
  const fetchTodos = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      setTodos([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const fetchedTodos = await todoService.fetchTodos(user.id)
      setTodos(fetchedTodos)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos'
      setError(errorMessage)
      console.error('Error fetching todos:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, isAuthenticated])

  /**
   * Add new todo with optimistic update
   */
  const addTodo = useCallback(async (data: CreateTodoData): Promise<TodoOperationResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Validate input
    const trimmedText = data.text?.trim()
    if (!trimmedText) {
      return { success: false, error: 'Please enter a task' }
    }

    // Create optimistic todo
    const optimisticTodo: OptimisticTodo = {
      id: `temp-${Date.now()}`, // Temporary ID
      user_id: user.id,
      text: trimmedText,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOptimistic: true,
      isLoading: true
    }

    try {
      // Optimistically add todo to UI
      setTodos(current => [optimisticTodo, ...current])
      setError(null)

      // Create todo in database
      const newTodo = await todoService.createTodo(user.id, data)
      
      // Replace optimistic todo with real todo
      setTodos(current => 
        current.map(todo => 
          todo.id === optimisticTodo.id 
            ? { ...newTodo, isOptimistic: false, isLoading: false }
            : todo
        )
      )

      return { success: true, todo: newTodo }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo'
      
      // Remove optimistic todo on failure
      setTodos(current => 
        current.filter(todo => todo.id !== optimisticTodo.id)
      )
      
      setError(errorMessage)
      console.error('Error adding todo:', err)
      
      return { success: false, error: errorMessage }
    }
  }, [user?.id])

  /**
   * Update todo with optimistic update
   */
  const updateTodo = useCallback(async (
    id: string, 
    updates: Partial<Todo>
  ): Promise<TodoOperationResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Store original todo for rollback
    const originalTodo = todos.find(todo => todo.id === id)
    if (!originalTodo) {
      return { success: false, error: 'Todo not found' }
    }

    try {
      // Optimistically update todo in UI
      setTodos(current =>
        current.map(todo =>
          todo.id === id
            ? { ...todo, ...updates, isLoading: true }
            : todo
        )
      )
      setError(null)

      // Update todo in database
      const updatedTodo = await todoService.updateTodo(user.id, id, updates)
      
      // Update with real data from database
      setTodos(current =>
        current.map(todo =>
          todo.id === id
            ? { ...updatedTodo, isLoading: false }
            : todo
        )
      )

      return { success: true, todo: updatedTodo }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo'
      
      // Rollback optimistic update
      setTodos(current =>
        current.map(todo =>
          todo.id === id
            ? { ...originalTodo, isLoading: false }
            : todo
        )
      )
      
      setError(errorMessage)
      console.error('Error updating todo:', err)
      
      return { success: false, error: errorMessage }
    }
  }, [user?.id, todos])

  /**
   * Delete todo with optimistic update
   */
  const deleteTodo = useCallback(async (id: string): Promise<TodoOperationResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Store original todo for rollback
    const originalTodo = todos.find(todo => todo.id === id)
    if (!originalTodo) {
      return { success: false, error: 'Todo not found' }
    }

    try {
      // Optimistically remove todo from UI
      setTodos(current => current.filter(todo => todo.id !== id))
      setError(null)

      // Delete todo from database
      await todoService.deleteTodo(user.id, id)

      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo'
      
      // Rollback optimistic update
      setTodos(current => [...current, originalTodo].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))
      
      setError(errorMessage)
      console.error('Error deleting todo:', err)
      
      return { success: false, error: errorMessage }
    }
  }, [user?.id, todos])

  /**
   * Toggle todo completion status
   */
  const toggleTodo = useCallback(async (id: string): Promise<TodoOperationResult> => {
    const todo = todos.find(t => t.id === id)
    if (!todo) {
      return { success: false, error: 'Todo not found' }
    }

    return updateTodo(id, { completed: !todo.completed })
  }, [todos, updateTodo])

  /**
   * Refetch todos from database
   */
  const refetch = useCallback(async () => {
    await fetchTodos()
  }, [fetchTodos])

  /**
   * Handle real-time updates from Supabase
   */
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    setTodos(current => {
      switch (eventType) {
        case 'INSERT':
          if (newRecord && newRecord.user_id === user?.id) {
            const newTodo = {
              id: newRecord.id,
              user_id: newRecord.user_id,
              text: newRecord.title,
              completed: newRecord.completed,
              created_at: newRecord.created_at,
              updated_at: newRecord.updated_at
            }
            
            // Don't add if we already have this todo (avoid duplicates from optimistic updates)
            if (!current.find(todo => todo.id === newTodo.id)) {
              return [newTodo, ...current]
            }
          }
          return current

        case 'UPDATE':
          if (newRecord && newRecord.user_id === user?.id) {
            const updatedTodo = {
              id: newRecord.id,
              user_id: newRecord.user_id,
              text: newRecord.title,
              completed: newRecord.completed,
              created_at: newRecord.created_at,
              updated_at: newRecord.updated_at
            }
            
            return current.map(todo =>
              todo.id === updatedTodo.id ? { ...updatedTodo, isLoading: false } : todo
            )
          }
          return current

        case 'DELETE':
          if (oldRecord && oldRecord.user_id === user?.id) {
            return current.filter(todo => todo.id !== oldRecord.id)
          }
          return current

        default:
          return current
      }
    })
  }, [user?.id])

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return

    console.log('Setting up real-time subscription for todos')
    const subscription = todoService.subscribeToTodos(user.id, handleRealtimeUpdate)

    return () => {
      console.log('Cleaning up real-time subscription')
      subscription.unsubscribe()
    }
  }, [user?.id, isAuthenticated, handleRealtimeUpdate])

  // Initial fetch
  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch
  }
}