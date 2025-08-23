'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthFormData } from '@/types/auth'

type AuthMode = 'signin' | 'signup' | 'reset'

interface AuthFormProps {
  mode?: AuthMode
  onSuccess?: () => void
  className?: string
}

export default function AuthForm({ 
  mode: initialMode = 'signin', 
  onSuccess,
  className = '' 
}: AuthFormProps) {
  const { signIn, signUp, resetPassword, isLoading } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'E-mail adresi gerekli'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-mail adresi girin'
    }

    // Password validation
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Şifre gerekli'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Şifre en az 8 karakter olmalı'
      }

      // Confirm password validation for signup
      if (mode === 'signup') {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Şifre tekrarı gerekli'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Şifreler eşleşmiyor'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let result

      switch (mode) {
        case 'signin':
          result = await signIn(formData.email, formData.password)
          break
        case 'signup':
          result = await signUp(formData.email, formData.password)
          break
        case 'reset':
          result = await resetPassword(formData.email)
          break
        default:
          throw new Error('Invalid auth mode')
      }

      if (result.success) {
        if (mode === 'reset') {
          setMessage('Şifre sıfırlama e-mailı gönderildi. Lütfen e-mail kutunuzu kontrol edin.')
          setFormData({ email: '', password: '', confirmPassword: '' })
        } else {
          onSuccess?.()
        }
      } else {
        setMessage(result.error || 'İşlem başarısız oldu')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Mode-specific content
  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Giriş Yap'
      case 'signup':
        return 'Kayıt Ol'
      case 'reset':
        return 'Şifre Sıfırla'
      default:
        return 'Giriş'
    }
  }

  const getSubmitText = () => {
    if (isSubmitting) return 'İşleniyor...'
    
    switch (mode) {
      case 'signin':
        return 'Giriş Yap'
      case 'signup':
        return 'Kayıt Ol'
      case 'reset':
        return 'Şifre Sıfırla'
      default:
        return 'Devam Et'
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          {getTitle()}
        </h2>

        {message && (
          <div className={`p-4 rounded-md mb-4 ${
            mode === 'reset' && !message.includes('başarısız')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail Adresi
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ornek@email.com"
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="En az 8 karakter"
                disabled={isSubmitting}
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          {/* Confirm Password Field */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre Tekrarı
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Şifreyi tekrar girin"
                disabled={isSubmitting}
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {getSubmitText()}
          </button>
        </form>

        {/* Mode Switching */}
        <div className="mt-6 space-y-2 text-center text-sm">
          {mode === 'signin' && (
            <>
              <p className="text-gray-600">
                Hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isSubmitting}
                >
                  Kayıt Ol
                </button>
              </p>
              <p className="text-gray-600">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isSubmitting}
                >
                  Şifremi Unuttum
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={isSubmitting}
              >
                Giriş Yap
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p className="text-gray-600">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={isSubmitting}
              >
                Giriş sayfasına dön
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}