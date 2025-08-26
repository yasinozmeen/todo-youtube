'use client'

import React, { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

/**
 * ErrorBoundary - Catches JavaScript errors in component tree
 * Features:
 * - Production-friendly error display
 * - Error reporting capability
 * - Graceful recovery options
 * - User-friendly error messages
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { errorBoundary: true, errorId: this.state.errorId }
      // })
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              {/* Error Icon */}
              <div className="mb-4">
                <svg 
                  className="w-16 h-16 text-red-500 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>

              {/* Error Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>

              {/* Error Description */}
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Don&apos;t worry, this has been logged and we&apos;ll look into it.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                  <h4 className="font-medium text-red-800 text-sm mb-2">
                    Error Details (Development):
                  </h4>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack && (
                      <>
                        <br />
                        <br />
                        Stack Trace:
                        <br />
                        {this.state.error.stack}
                      </>
                    )}
                  </pre>
                </div>
              )}

              {/* Error ID */}
              {this.state.errorId && (
                <p className="text-xs text-gray-500 mb-6">
                  Error ID: {this.state.errorId}
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
                <button
                  onClick={this.handleRetry}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors duration-200"
                >
                  Reload Page
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 mt-6">
                If the problem persists, please try refreshing the page or contact support.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}