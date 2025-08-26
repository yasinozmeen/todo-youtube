import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../TodoList'
import type { OptimisticTodo } from '@/types/todo'

describe('Todo Completion Tests', () => {
  const mockOnToggleTodo = jest.fn()
  const mockOnDeleteTodo = jest.fn()

  const sampleTodos: OptimisticTodo[] = [
    {
      id: '1',
      user_id: 'user1',
      text: 'Test todo 1',
      completed: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      isOptimistic: false,
      isLoading: false
    },
    {
      id: '2',
      user_id: 'user1',
      text: 'Test todo 2',
      completed: true,
      created_at: '2023-01-01T01:00:00Z',
      updated_at: '2023-01-01T01:00:00Z',
      isOptimistic: false,
      isLoading: false
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Checkbox Interface', () => {
    it('renders checkbox for each todo item', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)
    })

    it('shows checked checkbox for completed todos', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const completedCheckbox = screen.getByRole('checkbox', { 
        name: 'Mark as incomplete' 
      })
      expect(completedCheckbox).toHaveClass('bg-green-500')
    })

    it('shows unchecked checkbox for uncompleted todos', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const uncompletedCheckbox = screen.getByRole('checkbox', { 
        name: 'Mark as complete' 
      })
      expect(uncompletedCheckbox).toHaveClass('border-gray-300')
    })
  })

  describe('Toggle Completion via Checkbox', () => {
    it('calls onToggleTodo when checkbox is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const checkbox = screen.getByRole('checkbox', { 
        name: 'Mark as complete' 
      })
      
      await user.click(checkbox)
      
      expect(mockOnToggleTodo).toHaveBeenCalledWith('1')
      expect(mockOnToggleTodo).toHaveBeenCalledTimes(1)
    })

    it('calls onToggleTodo for completed todos', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const completedCheckbox = screen.getByRole('checkbox', { 
        name: 'Mark as incomplete' 
      })
      
      await user.click(completedCheckbox)
      
      expect(mockOnToggleTodo).toHaveBeenCalledWith('2')
    })
  })

  describe('Visual Completion Feedback', () => {
    it('shows strikethrough text for completed todos', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const completedTodoText = screen.getByText('Test todo 2')
      expect(completedTodoText).toHaveClass('line-through')
      expect(completedTodoText).toHaveClass('text-gray-500')
    })

    it('shows normal text for uncompleted todos', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const uncompletedTodoText = screen.getByText('Test todo 1')
      expect(uncompletedTodoText).toHaveClass('text-gray-900')
      expect(uncompletedTodoText).not.toHaveClass('line-through')
    })

    it('applies correct visual hierarchy', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const completedTodo = screen.getByText('Test todo 2').closest('div')
      const uncompletedTodo = screen.getByText('Test todo 1').closest('div')
      
      expect(completedTodo).toBeInTheDocument()
      expect(uncompletedTodo).toBeInTheDocument()
    })
  })

  describe('Optimistic Updates', () => {
    it('shows loading state for optimistic todos', () => {
      const optimisticTodos: OptimisticTodo[] = [
        {
          id: '3',
          user_id: 'user1',
          text: 'Optimistic todo',
          completed: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          isOptimistic: true,
          isLoading: true
        }
      ]

      render(
        <TodoList
          todos={optimisticTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      expect(screen.getByText('Saving...')).toBeInTheDocument()
      
      const todoContainer = screen.getByText('Optimistic todo').closest('[class*="group"]')
      expect(todoContainer).toHaveClass('opacity-70')
    })

    it('disables checkbox when todo is loading', () => {
      const loadingTodos: OptimisticTodo[] = [
        {
          id: '4',
          user_id: 'user1',
          text: 'Loading todo',
          completed: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          isOptimistic: false,
          isLoading: true
        }
      ]

      render(
        <TodoList
          todos={loadingTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const checkbox = screen.getByRole('checkbox', { 
        name: /mark as/i 
      })
      expect(checkbox).toBeDisabled()
    })
  })

  describe('Statistics', () => {
    it('shows correct completion statistics', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      expect(screen.getByText('1 of 2 completed')).toBeInTheDocument()
    })

    it('updates statistics dynamically', () => {
      const allCompletedTodos: OptimisticTodo[] = [
        ...sampleTodos,
        {
          id: '3',
          user_id: 'user1',
          text: 'Another completed',
          completed: true,
          created_at: '2023-01-01T02:00:00Z',
          updated_at: '2023-01-01T02:00:00Z',
          isOptimistic: false,
          isLoading: false
        }
      ]

      render(
        <TodoList
          todos={allCompletedTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      expect(screen.getByText('2 of 3 completed')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels for checkboxes', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      expect(screen.getByRole('checkbox', { 
        name: 'Mark as complete' 
      })).toBeInTheDocument()
      
      expect(screen.getByRole('checkbox', { 
        name: 'Mark as incomplete' 
      })).toBeInTheDocument()
    })

    it('has focus indicators on checkboxes', () => {
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveClass('focus:ring-2')
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const firstCheckbox = screen.getByRole('checkbox', { 
        name: 'Mark as complete' 
      })
      
      await user.tab()
      expect(firstCheckbox).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockOnToggleTodo).toHaveBeenCalledWith('1')
    })
  })

  describe('Error Handling', () => {
    it('shows error state for todos with loading errors', () => {
      const errorTodos: OptimisticTodo[] = [
        {
          id: '5',
          user_id: 'user1',
          text: 'Error todo',
          completed: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          isOptimistic: false,
          isLoading: false
        }
      ]

      render(
        <TodoList
          todos={errorTodos}
          isLoading={false}
          error="Network error"
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      expect(screen.getByText(/connection issue/i)).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('handles rapid clicking gracefully', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={sampleTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const checkbox = screen.getByRole('checkbox', { 
        name: 'Mark as complete' 
      })
      
      // Simulate rapid clicking
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)
      
      // Should be called multiple times (no debouncing in component)
      expect(mockOnToggleTodo).toHaveBeenCalledTimes(3)
    })
  })
})