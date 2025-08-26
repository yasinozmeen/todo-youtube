/**
 * Performance utilities for Todo application
 * Provides debouncing, throttling, and performance monitoring
 */

/**
 * Debounce function to limit the rate of function execution
 * Useful for search inputs and API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle function to limit function execution to once per specified time period
 * Useful for scroll handlers and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map()

  /**
   * Start timing an operation
   */
  static start(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      const mark = `${name}-start`
      performance.mark(mark)
      this.marks.set(name, performance.now())
    }
  }

  /**
   * End timing an operation and log the result
   */
  static end(name: string, logToConsole = false): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = this.marks.get(name)
      if (startTime) {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (logToConsole) {
          console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
        }
        
        // Clean up
        this.marks.delete(name)
        performance.clearMarks(`${name}-start`)
        
        return duration
      }
    }
    return null
  }

  /**
   * Measure and log the performance of an async function
   */
  static async measure<T>(
    name: string,
    fn: () => Promise<T>,
    logToConsole = false
  ): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(name, logToConsole)
    }
  }

  /**
   * Monitor bundle size and report if too large
   */
  static checkBundleSize(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const transferSize = navigation.transferSize
          const maxSize = 500 * 1024 // 500KB threshold
          
          if (transferSize > maxSize) {
            console.warn(
              `⚠️ Bundle size warning: ${(transferSize / 1024).toFixed(1)}KB exceeds recommended ${maxSize / 1024}KB`
            )
          }
        }
      })
    }
  }

  /**
   * Monitor memory usage
   */
  static checkMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      if (memory) {
        const used = memory.usedJSHeapSize / 1024 / 1024
        const total = memory.totalJSHeapSize / 1024 / 1024
        const limit = memory.jsHeapSizeLimit / 1024 / 1024
        
        console.log(`🧠 Memory: ${used.toFixed(1)}MB used / ${total.toFixed(1)}MB total / ${limit.toFixed(1)}MB limit`)
        
        // Warn if using more than 80% of available memory
        if (used / limit > 0.8) {
          console.warn('⚠️ High memory usage detected')
        }
      }
    }
  }
}

/**
 * Optimized list rendering utilities
 */
export class ListOptimization {
  /**
   * Virtual scrolling helper for large lists
   * Returns visible items based on scroll position and container height
   */
  static getVisibleItems<T>(
    items: T[],
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    overscan = 5
  ): { startIndex: number; endIndex: number; visibleItems: T[] } {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    const visibleItems = items.slice(startIndex, endIndex + 1)
    
    return { startIndex, endIndex, visibleItems }
  }

  /**
   * Memoization helper for expensive computations
   */
  static memoize<Args extends any[], Return>(
    fn: (...args: Args) => Return,
    maxSize = 100
  ): (...args: Args) => Return {
    const cache = new Map<string, Return>()
    
    return (...args: Args): Return => {
      const key = JSON.stringify(args)
      
      if (cache.has(key)) {
        return cache.get(key)!
      }
      
      const result = fn(...args)
      
      // Prevent memory leaks by limiting cache size
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value
        if (firstKey !== undefined) {
          cache.delete(firstKey)
        }
      }
      
      cache.set(key, result)
      return result
    }
  }
}

/**
 * Accessibility performance helpers
 */
export class AccessibilityOptimization {
  /**
   * Check if user prefers reduced motion
   */
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Respect user's reduced motion preference for animations
   */
  static getAnimationClass(animationClass: string, fallbackClass = ''): string {
    return this.prefersReducedMotion() ? fallbackClass : animationClass
  }

  /**
   * Focus management for better keyboard navigation
   */
  static manageFocus(element: HTMLElement | null, options?: FocusOptions): void {
    if (element && typeof element.focus === 'function') {
      // Small delay to ensure DOM has updated
      requestAnimationFrame(() => {
        element.focus(options)
      })
    }
  }

  /**
   * Announce dynamic content changes to screen readers
   */
  static announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof document === 'undefined') return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only' // Visually hidden but accessible
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement is made
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (process.env.NODE_ENV === 'development') {
    PerformanceMonitor.checkBundleSize()
    
    // Log memory usage every 30 seconds in development
    setInterval(() => {
      PerformanceMonitor.checkMemoryUsage()
    }, 30000)
  }
}