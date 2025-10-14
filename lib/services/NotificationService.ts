import { IToastConfig } from '@/lib/types'
import { toast as sonnerToast, ToastT } from 'sonner'

/**
 * NotificationService - Shows toast notifications
 * 
 * Simple wrapper around Sonner toast library
 */
export class NotificationService {
  private static instance: NotificationService | null = null
  private config: IToastConfig
  private activeToasts: Map<string, string> = new Map()
  
  /** Get or create single instance */
  public static getInstance(config?: IToastConfig): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(config)
    }
    return NotificationService.instance
  }
  
  private constructor(config?: IToastConfig) {
    this.config = config || {
      position: 'top-right',
      duration: 4000,
      richColors: true
    }
  }
  
  /** Show success toast */
  success(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.success(message, { duration: this.config.duration, ...options })
    this.activeToasts.set(String(id), 'success')
    return String(id)
  }
  
  /** Show error toast */
  error(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.error(message, { duration: this.config.duration, ...options })
    this.activeToasts.set(String(id), 'error')
    return String(id)
  }
  
  /** Show warning toast */
  warning(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.warning(message, { duration: this.config.duration, ...options })
    this.activeToasts.set(String(id), 'warning')
    return String(id)
  }
  
  /** Show info toast */
  info(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.info(message, { duration: this.config.duration, ...options })
    this.activeToasts.set(String(id), 'info')
    return String(id)
  }
  
  /** Show loading toast */
  loading(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast.loading(message, { duration: Infinity, ...options })
    this.activeToasts.set(String(id), 'loading')
    return String(id)
  }
  
  /** Show custom toast */
  custom(message: string, options?: Partial<ToastT>): string {
    const id = sonnerToast(message, { duration: this.config.duration, ...options })
    this.activeToasts.set(String(id), 'custom')
    return String(id)
  }
  
  /** Dismiss specific toast */
  dismiss(id: string): void {
    sonnerToast.dismiss(id)
    this.activeToasts.delete(id)
  }
  
  /** Dismiss all toasts */
  dismissAll(): void {
    sonnerToast.dismiss()
    this.activeToasts.clear()
  }
  
  /** Promise-based toast for async operations */
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ): Promise<T> {
    sonnerToast.promise(promise, messages)
    return promise
  }
  
  /** Auth-specific toasts */
  auth = {
    signInSuccess: (userName?: string) => 
      this.success(userName ? `Welcome back, ${userName}!` : 'Successfully signed in!'),
    signOutSuccess: () => this.success('Successfully signed out'),
    signInError: (error?: string) => this.error(error || 'Failed to sign in. Please try again.'),
    sessionExpired: () => this.warning('Your session has expired. Please sign in again.'),
    unauthorized: () => this.error('You are not authorized to perform this action.')
  }
  
  /** Form-specific toasts */
  form = {
    validationError: (message = 'Please check the form and try again.') => this.error(message),
    saveSuccess: (item = 'Item') => this.success(`${item} saved successfully!`),
    saveError: (item = 'Item') => this.error(`Failed to save ${item.toLowerCase()}. Please try again.`),
    deleteSuccess: (item = 'Item') => this.success(`${item} deleted successfully!`),
    deleteError: (item = 'Item') => this.error(`Failed to delete ${item.toLowerCase()}. Please try again.`)
  }
  
  /** Network-specific toasts */
  network = {
    connectionError: () => this.error('Network connection error. Please check your internet connection.'),
    serverError: () => this.error('Server error. Please try again later.'),
    timeoutError: () => this.error('Request timed out. Please try again.')
  }
  
  /** Get count of active toasts */
  getActiveToastsCount(): number {
    return this.activeToasts.size
  }
  
  /** Get active toasts by type */
  getActiveToastsByType(type: string): string[] {
    return Array.from(this.activeToasts.entries())
      .filter(([_, toastType]) => toastType === type)
      .map(([id]) => id)
  }
  
  /** Check if any loading toasts are active */
  hasLoadingToasts(): boolean {
    return this.getActiveToastsByType('loading').length > 0
  }
  
  /** Update config */
  updateConfig(config: Partial<IToastConfig>): void {
    this.config = { ...this.config, ...config }
  }
  
  /** Get config */
  getConfig(): IToastConfig {
    return { ...this.config }
  }
}

export const notificationService = NotificationService.getInstance()