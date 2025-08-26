import { supabase } from './supabase'
import type { Todo, CreateTodoData, TodoRow, TodoInsert } from '@/types/todo'

/**
 * Todo Service - Supabase database operations for todos
 * Handles CRUD operations with proper error handling and type safety
 */
export class TodoService {
  
  /**
   * Fetch all todos for the current user, sorted by creation date (newest first)
   */
  static async fetchTodos(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching todos:', error)
      throw new Error(`Failed to fetch todos: ${error.message}`)
    }
    
    return data.map(TodoService.mapRowToTodo)
  }
  
  /**
   * Create a new todo
   */
  static async createTodo(userId: string, data: CreateTodoData): Promise<Todo> {
    // Validate input
    const trimmedText = data.text?.trim()
    if (!trimmedText) {
      throw new Error('Please enter a task')
    }
    
    const todoInsert: TodoInsert = {
      user_id: userId,
      title: trimmedText, // Database uses 'title' field
      completed: false
    }
    
    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert(todoInsert as any)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating todo:', error)
      throw new Error(`Failed to create todo: ${error.message}`)
    }
    
    return TodoService.mapRowToTodo(newTodo)
  }
  
  /**
   * Update a todo
   */
  static async updateTodo(
    userId: string, 
    todoId: string, 
    updates: Partial<Pick<Todo, 'text' | 'completed'>>
  ): Promise<Todo> {
    // Map 'text' to 'title' for database
    const dbUpdates: Partial<TodoRow> = {
      updated_at: new Date().toISOString()
    }
    
    if (updates.text !== undefined) {
      const trimmedText = updates.text?.trim()
      if (!trimmedText) {
        throw new Error('Please enter a task')
      }
      dbUpdates.title = trimmedText
    }
    
    if (updates.completed !== undefined) {
      dbUpdates.completed = updates.completed
    }
    
    const { data, error } = await supabase
      .from('todos')
      .update(dbUpdates as any)
      .eq('id', todoId)
      .eq('user_id', userId) // Ensure user can only update their own todos
      .select()
      .single()
    
    if (error) {
      console.error('Error updating todo:', error)
      throw new Error(`Failed to update todo: ${error.message}`)
    }
    
    return TodoService.mapRowToTodo(data)
  }
  
  /**
   * Delete a todo
   */
  static async deleteTodo(userId: string, todoId: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId) // Ensure user can only delete their own todos
    
    if (error) {
      console.error('Error deleting todo:', error)
      throw new Error(`Failed to delete todo: ${error.message}`)
    }
  }
  
  /**
   * Toggle todo completion status
   */
  static async toggleTodo(userId: string, todoId: string): Promise<Todo> {
    // First, get current todo to toggle its status
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select('completed')
      .eq('id', todoId)
      .eq('user_id', userId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching todo for toggle:', fetchError)
      throw new Error(`Failed to fetch todo: ${fetchError.message}`)
    }
    
    // Toggle the completion status
    return TodoService.updateTodo(userId, todoId, { 
      completed: !(currentTodo as any).completed 
    })
  }
  
  /**
   * Set up real-time subscription for todos
   */
  static subscribeToTodos(
    userId: string,
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
    
    return subscription
  }
  
  /**
   * Map database row to application Todo type
   * Handles the 'title' -> 'text' mapping
   */
  private static mapRowToTodo(row: TodoRow): Todo {
    return {
      id: row.id,
      user_id: row.user_id,
      text: row.title, // Map 'title' field to 'text'
      completed: row.completed,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }
}

// Export convenience functions
export const todoService = {
  fetchTodos: TodoService.fetchTodos,
  createTodo: TodoService.createTodo,
  updateTodo: TodoService.updateTodo,
  deleteTodo: TodoService.deleteTodo,
  toggleTodo: TodoService.toggleTodo,
  subscribeToTodos: TodoService.subscribeToTodos
}