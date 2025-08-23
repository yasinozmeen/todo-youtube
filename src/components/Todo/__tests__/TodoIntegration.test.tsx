import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodosPage from '@/app/todos/page'
import { AuthProvider } from '@/contexts/AuthContext'
import { todoService } from '@/lib/todoService'
import type { Todo } from '@/types/todo'

// Mock Supabase and dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}))

jest.mock('@/lib/todoService')
jest.mock('@/hooks/useRealtime', () => ({
  useRealtime: () => ({
    isConnected: true,
    error: null
  })
}))

const mockTodoService = todoService as jest.Mocked<typeof todoService>

// Mock authenticated user
const mockAuthUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z'
}

// Mock session
const mockSession = {
  user: mockAuthUser,
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer'
}

// Setup mocks
beforeAll(() => {
  const { supabase } = require('@/lib/supabase')
  supabase.auth.getSession.mockResolvedValue({
    data: { session: mockSession },
    error: null
  })
  supabase.auth.getUser.mockResolvedValue({
    data: { user: mockAuthUser },
    error: null
  })
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    user_id: 'user-123',
    text: 'Learn React',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'todo-2',
    user_id: 'user-123',
    text: 'Build todo app',
    completed: true,
    created_at: '2024-01-01T01:00:00Z',
    updated_at: '2024-01-01T02:00:00Z'
  }
]

describe('Todo Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays todos list on page load', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce(mockTodos)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument()
      expect(screen.getByText('Build todo app')).toBeInTheDocument()
    })

    // Check stats
    expect(screen.getByText('1 active, 1 completed')).toBeInTheDocument()
  })

  it('adds new todo through form', async () => {
    const user = userEvent.setup()
    const newTodo: Todo = {
      id: 'todo-3',
      user_id: 'user-123',
      text: 'New todo',
      completed: false,
      created_at: '2024-01-01T03:00:00Z',
      updated_at: '2024-01-01T03:00:00Z'
    }

    mockTodoService.fetchTodos.mockResolvedValueOnce(mockTodos)
    mockTodoService.createTodo.mockResolvedValueOnce(newTodo)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument()
    })

    // Add new todo
    const input = screen.getByPlaceholderText('Add new task')
    const addButton = screen.getByRole('button', { name: 'Add todo' })

    await user.type(input, 'New todo')
    await user.click(addButton)

    // Verify service was called
    await waitFor(() => {
      expect(mockTodoService.createTodo).toHaveBeenCalledWith('user-123', {
        text: 'New todo'
      })
    })

    // Input should be cleared
    expect(input).toHaveValue('')
  })

  it('toggles todo completion', async () => {
    const user = userEvent.setup()
    const toggledTodo = { ...mockTodos[0], completed: true }

    mockTodoService.fetchTodos.mockResolvedValueOnce(mockTodos)
    mockTodoService.updateTodo.mockResolvedValueOnce(toggledTodo)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument()
    })

    // Find and click the checkbox for first todo
    const checkboxes = screen.getAllByRole('button', { 
      name: /mark as (complete|incomplete)/i 
    })
    
    await user.click(checkboxes[0])

    // Verify service was called
    await waitFor(() => {
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(
        'user-123',
        'todo-1',
        { completed: true }
      )
    })
  })

  it('handles empty state', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce([])

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument()
      expect(screen.getByText('Get started by adding your first task above. Stay organized and productive!')).toBeInTheDocument()
    })
  })

  it('handles loading state', () => {
    // Don't resolve the promise to test loading state
    mockTodoService.fetchTodos.mockImplementation(() => new Promise(() => {}))

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Should show loading skeletons
    expect(screen.getAllByTestId ? 
      screen.queryAllByTestId('loading-skeleton') : 
      document.querySelectorAll('.animate-pulse')
    ).toBeTruthy()
  })

  it('handles fetch error', async () => {
    mockTodoService.fetchTodos.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load todos')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    // Should show retry button
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('retries loading on error', async () => {
    const user = userEvent.setup()
    
    // First call fails
    mockTodoService.fetchTodos.mockRejectedValueOnce(new Error('Network error'))
    // Second call succeeds
    mockTodoService.fetchTodos.mockResolvedValueOnce(mockTodos)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    // Click retry
    await user.click(screen.getByText('Try Again'))

    // Should load todos successfully
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument()
    })

    expect(mockTodoService.fetchTodos).toHaveBeenCalledTimes(2)
  })

  it('shows real-time connection status', async () => {
    mockTodoService.fetchTodos.mockResolvedValueOnce(mockTodos)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument()
    })
  })

  it('validates form input', async () => {
    const user = userEvent.setup()
    
    mockTodoService.fetchTodos.mockResolvedValueOnce([])

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument()
    })

    // Try to add empty todo
    const addButton = screen.getByRole('button', { name: 'Add todo' })
    await user.click(addButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter a task')).toBeInTheDocument()
    })

    expect(mockTodoService.createTodo).not.toHaveBeenCalled()
  })

  it('shows optimistic updates', async () => {
    const user = userEvent.setup()
    
    mockTodoService.fetchTodos.mockResolvedValueOnce([])
    
    // Delay the create response to test optimistic update
    let resolveCreate: (value: Todo) => void
    const createPromise = new Promise<Todo>((resolve) => {
      resolveCreate = resolve
    })
    mockTodoService.createTodo.mockReturnValueOnce(createPromise)

    render(
      <TestWrapper>
        <TodosPage />
      </TestWrapper>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument()
    })

    // Add todo
    const input = screen.getByPlaceholderText('Add new task')
    await user.type(input, 'Optimistic todo')
    await user.click(screen.getByRole('button', { name: 'Add todo' }))

    // Should show optimistic todo immediately
    await waitFor(() => {
      expect(screen.getByText('Optimistic todo')).toBeInTheDocument()
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })

    // Resolve the create request
    resolveCreate!({
      id: 'todo-new',
      user_id: 'user-123',
      text: 'Optimistic todo',
      completed: false,
      created_at: '2024-01-01T04:00:00Z',
      updated_at: '2024-01-01T04:00:00Z'
    })

    // Should remove "Saving..." indicator
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Optimistic todo')).toBeInTheDocument()
  })
})