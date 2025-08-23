export interface User {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  user_id: string
  full_name?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthContextType extends Omit<AuthState, 'user'> {
  user: any // Supabase User type
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
}