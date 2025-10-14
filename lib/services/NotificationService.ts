import { IToastConfig } from '@/lib/types'
import { toast as sonnerToast, ToastT } from 'sonner'

/**
 * Notification service class for managing toast notifications
 * Provides a centralized interface for all notification operations
 */
export class NotificationService {
  private static instance: NotificationService | null = null
  private _config: IToastConfig
  private _activeToasts: Map<string, string> = new Map()
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(config?: IToastConfig): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(config)
    }
    return NotificationService.instance
  }
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor(config?: IToastConfig) {
    this._config = config || {
      position: 'top-right',
      duration: 4000,
      richColors: true
    }
  }
  
  /**
   * Show success notification
   */
  success(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.success(message, {
      duration: this._config.duration,
      ...options
    })
    
    this._activeToasts.set(String(id), 'success')
    return String(id)
  }
  
  /**
   * Show error notification
   */
  error(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.error(message, {
      duration: this._config.duration,
      ...options
    })
    
    this._activeToasts.set(String(id), 'error')
    return String(id)
  }
  
  /**
   * Show warning notification
   */
  warning(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.warning(message, {
      duration: this._config.duration,
      ...options
    })
    
    this._activeToasts.set(String(id), 'warning')
    return String(id)
  }
  
  /**
   * Show info notification
   */
  info(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.info(message, {
      duration: this._config.duration,
      ...options
    })
    
    this._activeToasts.set(String(id), 'info')
    return String(id)
  }
  
  /**
   * Show loading notification
   */
  loading(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.loading(message, {
      duration: Infinity, // Loading toasts should not auto-dismiss
      ...options
    })
    
    this._activeToasts.set(String(id), 'loading')
    return String(id)
  }
  
  /**
   * Show custom notification
   */
  custom(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast(message, {
      duration: this._config.duration,
      ...options
    })
    
    this._activeToasts.set(String(id), 'custom')
    return String(id)
  }
  
  /**
   * Update existing notification
   */
  update(id: string, message: string, options?: Partial<ToastT>): void {
    // Sonner doesn't have a direct update method, so we dismiss and create new
    this.dismiss(id)
    this.custom(message, options)
  }
  
  /**
   * Dismiss specific notification
   */
  dismiss(id: string): void {
    sonnerToast.dismiss(id)
    this._activeToasts.delete(id)
  }
  
  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    sonnerToast.dismiss()
    this._activeToasts.clear()
  }
  
  /**
   * Promise-based notification for async operations
   */
  async promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ): Promise<T> {
    sonnerToast.promise(promise, {
      loading,
      success,
      error
    })
    
    return promise
  }
  
  /**
   * Authentication-specific notifications
   */
  auth = {
    signInSuccess: (userName?: string) => {
      const message = userName 
        ? `Welcome back, ${userName}!` 
        : 'Successfully signed in!'
      return this.success(message)
    },
    
    signOutSuccess: () => {
      return this.success('Successfully signed out')
    },
    
    signInError: (error?: string) => {
      const message = error || 'Failed to sign in. Please try again.'
      return this.error(message)
    },
    
    sessionExpired: () => {
      return this.warning('Your session has expired. Please sign in again.')
    },
    
    unauthorized: () => {
      return this.error('You are not authorized to perform this action.')
    }
  }
  
  /**
   * Form-specific notifications
   */
  form = {
    validationError: (message = 'Please check the form and try again.') => {
      return this.error(message)
    },
    
    saveSuccess: (itemName = 'Item') => {
      return this.success(`${itemName} saved successfully!`)
    },
    
    saveError: (itemName = 'Item') => {
      return this.error(`Failed to save ${itemName.toLowerCase()}. Please try again.`)
    },
    
    deleteSuccess: (itemName = 'Item') => {
      return this.success(`${itemName} deleted successfully!`)
    },
    
    deleteError: (itemName = 'Item') => {
      return this.error(`Failed to delete ${itemName.toLowerCase()}. Please try again.`)
    }
  }
  
  /**
   * Network-specific notifications
   */
  network = {
    connectionError: () => {
      return this.error('Network connection error. Please check your internet connection.')
    },
    
    serverError: () => {
      return this.error('Server error. Please try again later.')
    },
    
    timeoutError: () => {
      return this.error('Request timed out. Please try again.')
    }
  }
  
  /**
   * Get active toasts count
   */
  getActiveToastsCount(): number {
    return this._activeToasts.size
  }
  
  /**
   * Get active toasts by type
   */
  getActiveToastsByType(type: string): string[] {
    const toasts: string[] = []
    
    for (const [id, toastType] of this._activeToasts) {
      if (toastType === type) {
        toasts.push(id)
      }
    }
    
    return toasts
  }
  
  /**
   * Check if there are any active loading toasts
   */
  hasLoadingToasts(): boolean {
    return this.getActiveToastsByType('loading').length > 0
  }
  
  /**
   * Update notification configuration
   */
  updateConfig(config: Partial<IToastConfig>): void {
    this._config = { ...this._config, ...config }
  }
  
  /**
   * Get current configuration
   */
  getConfig(): IToastConfig {
    return { ...this._config }
  }
}

/**
 * Singleton instance export for easy access
 */
export const notificationService = NotificationService.getInstance()