import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from '../TodoForm'
import type { CreateTodoData, TodoOperationResult } from '@/types/todo'

describe('TodoForm Component', () => {
  const mockOnAddTodo = jest.fn<Promise<TodoOperationResult>, [CreateTodoData]>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders input field and add button', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    expect(screen.getByPlaceholderText('Add new task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add todo' })).toBeInTheDocument()
  })

  it('focuses input field on initial render', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    expect(input).toHaveFocus()
  })

  it('adds todo when button is clicked with valid text', async () => {
    const user = userEvent.setup()
    mockOnAddTodo.mockResolvedValueOnce({ success: true })

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    await user.type(input, 'Test todo')
    await user.click(button)
    
    expect(mockOnAddTodo).toHaveBeenCalledWith({ text: 'Test todo' })
  })

  it('adds todo when Enter key is pressed with valid text', async () => {
    const user = userEvent.setup()
    mockOnAddTodo.mockResolvedValueOnce({ success: true })

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    
    await user.type(input, 'Test todo{enter}')
    
    expect(mockOnAddTodo).toHaveBeenCalledWith({ text: 'Test todo' })
  })

  it('clears input after successful submission', async () => {
    const user = userEvent.setup()
    mockOnAddTodo.mockResolvedValueOnce({ success: true })

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    
    await user.type(input, 'Test todo{enter}')
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('shows validation error for empty input', async () => {
    const user = userEvent.setup()

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    await user.click(button)
    
    expect(screen.getByText('Please enter a task')).toBeInTheDocument()
    expect(mockOnAddTodo).not.toHaveBeenCalled()
  })

  it('shows validation error for whitespace-only input', async () => {
    const user = userEvent.setup()

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    await user.type(input, '   ')
    await user.click(button)
    
    expect(screen.getByText('Please enter a task')).toBeInTheDocument()
    expect(mockOnAddTodo).not.toHaveBeenCalled()
  })

  it('shows error message when todo creation fails', async () => {
    const user = userEvent.setup()
    mockOnAddTodo.mockResolvedValueOnce({ 
      success: false, 
      error: 'Network error' 
    })

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    
    await user.type(input, 'Test todo{enter}')
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
    
    // Input value should be preserved on error
    expect(input).toHaveValue('Test todo')
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    let resolveAddTodo: (value: TodoOperationResult) => void
    const addTodoPromise = new Promise<TodoOperationResult>((resolve) => {
      resolveAddTodo = resolve
    })
    mockOnAddTodo.mockReturnValueOnce(addTodoPromise)

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    await user.type(input, 'Test todo')
    await user.click(button)
    
    // Should show loading spinner
    expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed')
    expect(input).toBeDisabled()
    
    // Resolve the promise
    resolveAddTodo!({ success: true })
    
    await waitFor(() => {
      expect(button).not.toHaveClass('cursor-not-allowed')
      expect(input).not.toBeDisabled()
    })
  })

  it('trims whitespace from input text', async () => {
    const user = userEvent.setup()
    mockOnAddTodo.mockResolvedValueOnce({ success: true })

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    
    await user.type(input, '  Test todo  {enter}')
    
    expect(mockOnAddTodo).toHaveBeenCalledWith({ text: 'Test todo' })
  })

  it('shows character counter for long text', async () => {
    const user = userEvent.setup()

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const longText = 'a'.repeat(450)
    
    await user.type(input, longText)
    
    expect(screen.getByText('450/500 characters')).toBeInTheDocument()
  })

  it('prevents submission when text exceeds 500 characters', async () => {
    const user = userEvent.setup()

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const tooLongText = 'a'.repeat(501)
    
    await user.type(input, tooLongText)
    await user.click(screen.getByRole('button', { name: 'Add todo' }))
    
    expect(screen.getByText('Task is too long (max 500 characters)')).toBeInTheDocument()
    expect(mockOnAddTodo).not.toHaveBeenCalled()
  })

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup()

    render(<TodoForm onAddTodo={mockOnAddTodo} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    // Trigger error
    await user.click(button)
    expect(screen.getByText('Please enter a task')).toBeInTheDocument()
    
    // Start typing to clear error
    await user.type(input, 'T')
    expect(screen.queryByText('Please enter a task')).not.toBeInTheDocument()
  })

  it('handles external loading prop', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} isLoading={true} />)
    
    const input = screen.getByPlaceholderText('Add new task')
    const button = screen.getByRole('button', { name: 'Add todo' })
    
    expect(input).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('applies custom className', () => {
    const { container } = render(
      <TodoForm onAddTodo={mockOnAddTodo} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})