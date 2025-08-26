import '@testing-library/jest-dom'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({ data: [], error: null })),
      insert: jest.fn(() => ({ data: {}, error: null })),
      update: jest.fn(() => ({ data: {}, error: null })),
      delete: jest.fn(() => ({ data: null, error: null })),
    })),
    auth: {
      getUser: jest.fn(() => ({ data: { user: null }, error: null })),
      getSession: jest.fn(() => ({ data: { session: null }, error: null })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    })),
  },
  auth: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }
}))

// Mock todo service
jest.mock('@/lib/todoService', () => ({
  todoService: {
    fetchTodos: jest.fn(() => Promise.resolve([])),
    createTodo: jest.fn((userId, data) => Promise.resolve({
      id: 'new-todo-id',
      user_id: userId,
      text: data.text,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })),
    updateTodo: jest.fn((userId, todoId, updates) => Promise.resolve({
      id: todoId,
      user_id: userId,
      text: 'Updated todo',
      completed: updates.completed || false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    })),
    deleteTodo: jest.fn(() => Promise.resolve()),
    toggleTodo: jest.fn(() => Promise.resolve({
      id: 'todo-1',
      user_id: 'user-123',
      text: 'Test todo',
      completed: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    })),
    subscribeToTodos: jest.fn(() => ({
      unsubscribe: jest.fn()
    }))
  }
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock window.location
global.window = Object.create(window);
global.window.location = {
  origin: 'http://localhost:3000',
  href: 'http://localhost:3000'
};

// Global test setup
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}