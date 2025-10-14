import { AuthService } from '@/lib/services/AuthService'
import { NotificationService } from '@/lib/services/NotificationService'
import { ThemeService } from '@/lib/services/ThemeService'
import { LoadingState } from '@/lib/types'
import { loginSchema, validateLoginCredentials, type LoginFormInput } from '@/lib/validation'

/**
 * LoginController - Manages login page logic
 * 
 * Handles form validation, authentication, and theme switching using Zod schemas
 */
export class LoginController {
  private authService: AuthService
  private notificationService: NotificationService
  private themeService: ThemeService
  private showPassword: boolean = false
  private stateChangeHandler?: (state: LoadingState) => void
  private successHandler?: () => void
  private formData: LoginFormInput = {
    login: '',
    password: '',
    rememberMe: false,
  }
  private formErrors: Record<string, string> = {}
  private isSubmitting: boolean = false
  private loadingState: LoadingState = LoadingState.IDLE
  
  constructor() {
    // Get service instances
    this.authService = AuthService.getInstance()
    this.notificationService = NotificationService.getInstance()
    this.themeService = ThemeService.getInstance()
  }
  
  /** Submit login form */
  async submitForm(): Promise<boolean> {
    // Validate form data
    const validation = validateLoginCredentials(this.formData)
    
    console.log('📝 LoginController.submitForm - formData:', this.formData)
    console.log('✔️ LoginController.submitForm - validation:', validation)
    
    if (!validation.success) {
      this.formErrors = validation.errors || {}
      return false
    }
    
    this.isSubmitting = true
    this.loadingState = LoadingState.LOADING
    this.stateChangeHandler?.(LoadingState.LOADING)
    
    try {
      const result = await this.authService.signIn({
        login: validation.data!.login,
        password: validation.data!.password,
        rememberMe: validation.data!.rememberMe,
      })
      
      console.log('🎯 LoginController.submitForm - authService result:', result)
      
      if (result.success) {
        this.loadingState = LoadingState.SUCCESS
        this.stateChangeHandler?.(LoadingState.SUCCESS)
        this.successHandler?.()
        return true
      } else {
        this.loadingState = LoadingState.ERROR
        this.stateChangeHandler?.(LoadingState.ERROR)
        this.notificationService.auth.signInError(result.error)
        return false
      }
    } catch (error) {
      this.loadingState = LoadingState.ERROR
      this.stateChangeHandler?.(LoadingState.ERROR)
      this.notificationService.auth.signInError('Login failed')
      return false
    } finally {
      this.isSubmitting = false
    }
  }
  
  // Form field methods
  setFieldValue(name: keyof LoginFormInput, value: string | boolean): void {
    this.formData[name] = value as never
    // Clear error for this field when value changes
    delete this.formErrors[name]
  }
  
  getFieldValue(name: keyof LoginFormInput): string | boolean {
    return this.formData[name]
  }
  
  touchField(name: keyof LoginFormInput): void {
    // Validate single field
    const result = loginSchema.safeParse(this.formData)
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === name)
      if (fieldError) {
        this.formErrors[name] = fieldError.message
      }
    } else {
      delete this.formErrors[name]
    }
  }
  
  getFieldError(name: keyof LoginFormInput): string | undefined {
    return this.formErrors[name]
  }
  
  hasFieldError(name: keyof LoginFormInput): boolean {
    return Boolean(this.formErrors[name])
  }
  
  // Password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
  
  isPasswordVisible(): boolean {
    return this.showPassword
  }
  
  // Loading state
  isLoading(): boolean {
    return this.isSubmitting || this.authService.isLoading()
  }
  
  getLoadingState(): LoadingState {
    if (this.authService.isLoading()) {
      return this.authService.getLoadingState()
    }
    return this.loadingState
  }
  
  // Reset
  reset(): void {
    this.formData = {
      login: '',
      password: '',
      rememberMe: false,
    }
    this.formErrors = {}
    this.showPassword = false
    this.isSubmitting = false
    this.loadingState = LoadingState.IDLE
  }
  
  // Theme methods
  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
  
  getCurrentTheme(): 'light' | 'dark' | 'system' {
    return this.themeService.getTheme()
  }
  
  getResolvedTheme(): 'light' | 'dark' {
    return this.themeService.getResolvedTheme()
  }
  
  subscribeToTheme(callback: (theme: string, resolvedTheme: string) => void): () => void {
    return this.themeService.subscribe(callback)
  }
  
  // Auth subscription
  subscribeToAuth(callback: (user: any) => void): () => void {
    return this.authService.subscribe(callback)
  }
  
  // Event handlers
  setStateChangeHandler(handler: (state: LoadingState) => void): void {
    this.stateChangeHandler = handler
  }
  
  setSuccessHandler(handler: () => void): void {
    this.successHandler = handler
  }
  
  // Form data
  getFormData(): LoginFormInput {
    return { ...this.formData }
  }
  
  getFormErrors(): Record<string, string> {
    return { ...this.formErrors }
  }
  
  hasFormErrors(): boolean {
    return Object.keys(this.formErrors).length > 0
  }
  
  validateForm(): boolean {
    const validation = validateLoginCredentials(this.formData)
    
    if (!validation.success) {
      this.formErrors = validation.errors || {}
      return false
    }
    
    this.formErrors = {}
    return true
  }
}