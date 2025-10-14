import { FormManager, FormField } from '@/lib/form/FormManager'
import { ValidationRuleFactory } from '@/lib/validation/rules'
import { AuthService } from '@/lib/services/AuthService'
import { NotificationService } from '@/lib/services/NotificationService'
import { ThemeService } from '@/lib/services/ThemeService'
import { LoadingState, IAuthCredentials } from '@/lib/types'

/**
 * LoginController - Manages login page logic
 * 
 * Handles form validation, authentication, and theme switching
 */
export class LoginController {
  private formManager: FormManager
  private authService: AuthService
  private notificationService: NotificationService
  private themeService: ThemeService
  private showPassword: boolean = false
  private stateChangeHandler?: (state: LoadingState) => void
  private successHandler?: () => void
  
  constructor() {
    // Get service instances
    this.authService = AuthService.getInstance()
    this.notificationService = NotificationService.getInstance()
    this.themeService = ThemeService.getInstance()
    
    // Setup form
    this.formManager = new FormManager()
    this.setupForm()
  }
  
  /** Setup form fields and handlers */
  private setupForm(): void {
    // Add fields
    this.formManager.addField(new FormField('email', ValidationRuleFactory.createEmailRules()))
    this.formManager.addField(new FormField('password', ValidationRuleFactory.createPasswordRules()))
    this.formManager.addField(new FormField('rememberMe', []))
    
    // Set submit handler
    this.formManager.setSubmitHandler(async (data) => {
      const result = await this.authService.signIn({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe === 'true'
      })
      
      if (result.success) {
        this.successHandler?.()
      } else {
        throw new Error(result.error || 'Login failed')
      }
    })
    
    // Listen to state changes
    this.formManager.onStateChange((state) => this.stateChangeHandler?.(state))
  }
  
  /** Submit login form */
  async submitForm(): Promise<boolean> {
    return await this.formManager.submit()
  }
  
  /** Sign in with Google */
  async handleGoogleLogin(): Promise<void> {
    const result = await this.authService.signInWithGoogle()
    if (result.success) {
      this.successHandler?.()
    } else {
      this.notificationService.auth.signInError(result.error)
    }
  }
  
  // Form field methods
  setFieldValue(name: string, value: string): void {
    this.formManager.setFieldValue(name, value)
  }
  
  getFieldValue(name: string): string {
    return this.formManager.getFieldValue(name)
  }
  
  touchField(name: string): void {
    this.formManager.touchField(name)
  }
  
  getFieldError(name: string): string | undefined {
    return this.formManager.getField(name)?.error
  }
  
  hasFieldError(name: string): boolean {
    return Boolean(this.getFieldError(name))
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
    return this.formManager.isLoading() || this.authService.isLoading()
  }
  
  getLoadingState(): LoadingState {
    return this.authService.isLoading() 
      ? this.authService.getLoadingState()
      : this.formManager.getLoadingState()
  }
  
  // Reset
  reset(): void {
    this.formManager.reset()
    this.showPassword = false
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
  getFormData(): Record<string, string> {
    return this.formManager.getFormData()
  }
  
  getFormErrors(): Record<string, string> {
    return this.formManager.getFormErrors()
  }
  
  hasFormErrors(): boolean {
    return this.formManager.hasErrors()
  }
  
  validateForm(): boolean {
    return this.formManager.validateForm()
  }
}