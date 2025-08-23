'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, auth } from '@/lib/supabase'
import type { AuthContextType, Profile } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            await loadProfile(session.user.id)
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            await loadProfile(session.user.id)
          } else {
            setUser(null)
            setProfile(null)
          }
          setIsLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load user profile
  const loadProfile = async (userId: string) => {
    try {
      // TODO: Implement profile loading when database is set up
      // For now, just set a basic profile from user data
      setProfile({
        id: userId,
        user_id: userId,
        full_name: user?.user_metadata?.full_name || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  // Create user profile - will be implemented when database is set up
  const createProfile = async (userId: string) => {
    // TODO: Implement profile creation when database is set up
    console.log('Profile creation will be implemented when database is set up')
  }

  // Sign up
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await auth.signUp(email, password)
      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await auth.signIn(email, password)
      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await auth.resetPassword(email)
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}