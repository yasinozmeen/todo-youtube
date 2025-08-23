import type { Database } from './database'

// Database types from generated schema
export type TodoRow = Database['public']['Tables']['todos']['Row']
export type TodoInsert = Database['public']['Tables']['todos']['Insert']
export type TodoUpdate = Database['public']['Tables']['todos']['Update']

// Application types (simpler interface for UI components)
export interface Todo {
  id: string
  user_id: string
  text: string
  completed: boolean
  created_at: string
  updated_at: string
}

// Create todo form data
export interface CreateTodoData {
  text: string
}

// Todo filter states
export interface TodoFilters {
  status: 'all' | 'active' | 'completed'
  search: string
}

// Todo operation results
export interface TodoOperationResult {
  success: boolean
  error?: string
  todo?: Todo
}

// Real-time subscription events
export type TodoRealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export interface TodoRealtimePayload {
  eventType: TodoRealtimeEvent
  new?: TodoRow
  old?: TodoRow
}

// Optimistic update states
export interface OptimisticTodo extends Todo {
  isOptimistic?: boolean
  isLoading?: boolean
}

// Todo list state
export interface TodoListState {
  todos: OptimisticTodo[]
  isLoading: boolean
  error: string | null
  filters: TodoFilters
}

// Hook return types
export interface UseTodosReturn {
  todos: OptimisticTodo[]
  isLoading: boolean
  error: string | null
  addTodo: (data: CreateTodoData) => Promise<TodoOperationResult>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<TodoOperationResult>
  deleteTodo: (id: string) => Promise<TodoOperationResult>
  toggleTodo: (id: string) => Promise<TodoOperationResult>
  refetch: () => Promise<void>
}

export interface UseRealtimeReturn {
  isConnected: boolean
  error: string | null
}