import { renderHook, waitFor } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { useAuth } from '@/contexts/AuthContext'
import { todoService } from '@/lib/todoService'
import type { Todo } from '@/types/todo'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/lib/todoService')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockTodoService = todoService as jest.Mocked<typeof todoService>

const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
}

const mockTodo: Todo = {
  id: 'todo-1',
  user_id: 'user-123',
  text: 'Test todo',
  completed: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

describe('useTodos Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      profile: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn()
    })
  })

  it('fetches todos on mount', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])

    const { result } = renderHook(() => useTodos())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockTodoService.fetchTodos).toHaveBeenCalledWith('user-123')
    expect(result.current.todos).toEqual([mockTodo])
    expect(result.current.error).toBe(null)
  })

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch todos'
    mockTodoService.fetchTodos.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.todos).toEqual([])
  })

  it('does not fetch when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      profile: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn()
    })

    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockTodoService.fetchTodos).not.toHaveBeenCalled()
    expect(result.current.todos).toEqual([])
  })

  it('adds todo with optimistic update', async () => {
    const newTodo = { ...mockTodo, id: 'todo-2', text: 'New todo' }
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])
    mockTodoService.createTodo.mockResolvedValueOnce(newTodo)

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Add new todo
    const addResult = await result.current.addTodo({ text: 'New todo' })

    expect(addResult.success).toBe(true)
    expect(addResult.todo).toEqual(newTodo)
    expect(mockTodoService.createTodo).toHaveBeenCalledWith('user-123', { text: 'New todo' })
    
    // Check that todo was added to the list (at the beginning)
    expect(result.current.todos).toHaveLength(2)
    expect(result.current.todos[0]).toEqual(newTodo)
  })

  it('handles add todo error with rollback', async () => {
    const errorMessage = 'Failed to create todo'
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])
    mockTodoService.createTodo.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Try to add todo
    const addResult = await result.current.addTodo({ text: 'New todo' })

    expect(addResult.success).toBe(false)
    expect(addResult.error).toBe(errorMessage)
    
    // Check that optimistic todo was removed
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0]).toEqual(mockTodo)
    expect(result.current.error).toBe(errorMessage)
  })

  it('validates empty todo text', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce([])

    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Try to add empty todo
    const addResult = await result.current.addTodo({ text: '' })

    expect(addResult.success).toBe(false)
    expect(addResult.error).toBe('Please enter a task')
    expect(mockTodoService.createTodo).not.toHaveBeenCalled()
  })

  it('validates whitespace-only todo text', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce([])

    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Try to add whitespace-only todo
    const addResult = await result.current.addTodo({ text: '   ' })

    expect(addResult.success).toBe(false)
    expect(addResult.error).toBe('Please enter a task')
    expect(mockTodoService.createTodo).not.toHaveBeenCalled()
  })

  it('toggles todo completion', async () => {
    const updatedTodo = { ...mockTodo, completed: true }
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])
    mockTodoService.updateTodo.mockResolvedValueOnce(updatedTodo)

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Toggle todo
    const toggleResult = await result.current.toggleTodo('todo-1')

    expect(toggleResult.success).toBe(true)
    expect(mockTodoService.updateTodo).toHaveBeenCalledWith(
      'user-123', 
      'todo-1', 
      { completed: true }
    )
    
    // Check that todo was updated
    expect(result.current.todos[0]).toEqual(updatedTodo)
  })

  it('deletes todo with optimistic update', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])
    mockTodoService.deleteTodo.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Delete todo
    const deleteResult = await result.current.deleteTodo('todo-1')

    expect(deleteResult.success).toBe(true)
    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('user-123', 'todo-1')
    
    // Check that todo was removed
    expect(result.current.todos).toHaveLength(0)
  })

  it('handles delete error with rollback', async () => {
    const errorMessage = 'Failed to delete todo'
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])
    mockTodoService.deleteTodo.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Try to delete todo
    const deleteResult = await result.current.deleteTodo('todo-1')

    expect(deleteResult.success).toBe(false)
    expect(deleteResult.error).toBe(errorMessage)
    
    // Check that todo was restored
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0]).toEqual(mockTodo)
  })

  it('refetches todos', async () => {
    const updatedTodos = [mockTodo, { ...mockTodo, id: 'todo-2' }]
    mockTodoService.fetchTodos.mockResolvedValueOnce([mockTodo])

    const { result } = renderHook(() => useTodos())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Mock updated data for refetch
    mockTodoService.fetchTodos.mockResolvedValueOnce(updatedTodos)

    // Refetch
    await result.current.refetch()

    expect(result.current.todos).toEqual(updatedTodos)
    expect(mockTodoService.fetchTodos).toHaveBeenCalledTimes(2)
  })
})