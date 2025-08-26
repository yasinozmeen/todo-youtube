import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TodoList from '../TodoList'
import type { OptimisticTodo } from '@/types/todo'

describe('TodoList - Delete Functionality', () => {
  const mockOnDeleteTodo = jest.fn()
  const mockOnToggleTodo = jest.fn()

  const mockTodos: OptimisticTodo[] = [
    {
      id: '1',
      user_id: 'user-1',
      text: 'Test Todo 1',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOptimistic: false,
      isLoading: false
    },
    {
      id: '2',
      user_id: 'user-1', 
      text: 'Test Todo 2 - Completed',
      completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOptimistic: false,
      isLoading: false
    }
  ]

  beforeEach(() => {
    mockOnDeleteTodo.mockClear()
    mockOnToggleTodo.mockClear()
  })

  describe('Delete Button Rendering', () => {
    it('should render delete button when onDeleteTodo prop is provided', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i })
      expect(deleteButtons).toHaveLength(2)
    })

    it('should not render delete button when onDeleteTodo prop is not provided', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
        />
      )

      const deleteButtons = screen.queryAllByRole('button', { name: /delete todo/i })
      expect(deleteButtons).toHaveLength(0)
    })

    it('should have proper accessibility attributes', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete todo: Test Todo 1')
      expect(deleteButton).toHaveAttribute('title', 'Delete this todo')
      expect(deleteButton).toHaveAttribute('tabIndex', '0')
    })

    it('should have minimum 44px touch target for mobile accessibility', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toHaveClass('min-w-[44px]')
      expect(deleteButton).toHaveClass('min-h-[44px]')
    })
  })

  describe('Delete Interaction', () => {
    it('should call onDeleteTodo when delete button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      await user.click(deleteButton)

      expect(mockOnDeleteTodo).toHaveBeenCalledTimes(1)
      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1')
    })

    it('should call onDeleteTodo when Enter key is pressed', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      deleteButton.focus()
      await user.keyboard('{Enter}')

      expect(mockOnDeleteTodo).toHaveBeenCalledTimes(1)
      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1')
    })

    it('should call onDeleteTodo when Space key is pressed', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      deleteButton.focus()
      await user.keyboard(' ')

      expect(mockOnDeleteTodo).toHaveBeenCalledTimes(1)
      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1')
    })

    it('should not trigger delete on other key presses', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      deleteButton.focus()
      await user.keyboard('{Escape}')
      await user.keyboard('{Tab}')

      expect(mockOnDeleteTodo).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should disable delete button when todo is loading', () => {
      const loadingTodos: OptimisticTodo[] = [
        {
          ...mockTodos[0],
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

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toBeDisabled()
      expect(deleteButton).toHaveClass('disabled:opacity-30')
      expect(deleteButton).toHaveClass('disabled:cursor-not-allowed')
    })

    it('should not call onDeleteTodo when button is disabled', async () => {
      const user = userEvent.setup()
      const loadingTodos: OptimisticTodo[] = [
        {
          ...mockTodos[0],
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

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      await user.click(deleteButton)

      expect(mockOnDeleteTodo).not.toHaveBeenCalled()
    })
  })

  describe('Visual States', () => {
    it('should have proper hover styles for delete button', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toHaveClass('hover:text-red-500')
      expect(deleteButton).toHaveClass('hover:bg-red-50')
      expect(deleteButton).toHaveClass('hover:scale-105')
    })

    it('should have proper focus styles for delete button', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toHaveClass('focus:ring-red-500/20')
      expect(deleteButton).toHaveClass('focus:opacity-100')
    })

    it('should be visible on mobile and hidden on desktop until hover', () => {
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      expect(deleteButton).toHaveClass('sm:opacity-0')
      expect(deleteButton).toHaveClass('sm:group-hover:opacity-100')
      expect(deleteButton).toHaveClass('opacity-100') // Visible on mobile
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid delete clicks gracefully', async () => {
      const user = userEvent.setup()
      
      render(
        <TodoList
          todos={mockTodos}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete todo: test todo 1/i })
      
      // Rapid clicks
      await user.click(deleteButton)
      await user.click(deleteButton)
      await user.click(deleteButton)

      // Should have been called 3 times (handled by parent component)
      expect(mockOnDeleteTodo).toHaveBeenCalledTimes(3)
      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1')
    })

    it('should work with empty todo text', async () => {
      const user = userEvent.setup()
      const todosWithEmptyText: OptimisticTodo[] = [
        {
          ...mockTodos[0],
          text: ''
        }
      ]

      render(
        <TodoList
          todos={todosWithEmptyText}
          isLoading={false}
          error={null}
          onToggleTodo={mockOnToggleTodo}
          onDeleteTodo={mockOnDeleteTodo}
        />
      )

      const deleteButton = screen.getByRole('button', { name: 'Delete todo:' })
      await user.click(deleteButton)

      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1')
    })
  })
})