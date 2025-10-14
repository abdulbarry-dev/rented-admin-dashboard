import { FormManager, FormField } from '@/lib/form/FormManager'
import { ValidationRuleFactory } from '@/lib/validation/rules'
import { AuthService } from '@/lib/services/AuthService'
import { NotificationService } from '@/lib/services/NotificationService'
import { ThemeService } from '@/lib/services/ThemeService'
import { LoadingState, IAuthCredentials } from '@/lib/types'

/**
 * Login component controller class
 * Manages login form state, validation, and authentication operations
 */
export class LoginController {
  private formManager: FormManager
  private authService: AuthService
  private notificationService: NotificationService
  private themeService: ThemeService
  private _showPassword: boolean = false
  private _onStateChange?: (state: LoadingState) => void
  private _onSuccess?: () => void
  
  constructor() {
    this.authService = AuthService.getInstance()
    this.notificationService = NotificationService.getInstance()
    this.themeService = ThemeService.getInstance()
    
    // Initialize form manager with validation rules
    this.formManager = new FormManager()
    this.setupFormFields()
    this.setupFormHandlers()
  }
  
  /**
   * Setup form fields with validation rules
   */
  private setupFormFields(): void {
    // Email field with email validation
    const emailField = new FormField(
      'email',
      ValidationRuleFactory.createEmailRules()
    )
    
    // Password field with basic validation
    const passwordField = new FormField(
      'password',
      ValidationRuleFactory.createPasswordRules()
    )
    
    // Remember me field (no validation needed)
    const rememberMeField = new FormField('rememberMe', [])
    
    this.formManager.addField(emailField)
    this.formManager.addField(passwordField)
    this.formManager.addField(rememberMeField)
  }
  
  /**
   * Setup form submission handler
   */
  private setupFormHandlers(): void {
    this.formManager.setSubmitHandler(async (data) => {
      await this.handleCredentialsLogin({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe === 'true'
      })
    })
    
    this.formManager.onStateChange((state) => {
      this._onStateChange?.(state)
    })
  }
  
  /**
   * Handle credentials-based login
   */
  private async handleCredentialsLogin(credentials: IAuthCredentials): Promise<void> {
    const result = await this.authService.signIn(credentials)
    
    if (result.success) {
      this._onSuccess?.()
    } else {
      throw new Error(result.error || 'Login failed')
    }
  }
  
  /**
   * Handle Google OAuth login
   */
  async handleGoogleLogin(): Promise<void> {
    try {
      const result = await this.authService.signInWithGoogle()
      
      if (result.success) {
        this._onSuccess?.()
      } else {
        this.notificationService.auth.signInError(result.error)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed'
      this.notificationService.auth.signInError(message)
    }
  }
  
  /**
   * Submit the login form
   */
  async submitForm(): Promise<boolean> {
    return await this.formManager.submit()
  }
  
  /**
   * Set field value
   */
  setFieldValue(fieldName: string, value: string): void {
    this.formManager.setFieldValue(fieldName, value)
  }
  
  /**
   * Get field value
   */
  getFieldValue(fieldName: string): string {
    return this.formManager.getFieldValue(fieldName)
  }
  
  /**
   * Touch field (mark as interacted with)
   */
  touchField(fieldName: string): void {
    this.formManager.touchField(fieldName)
  }
  
  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string | undefined {
    return this.formManager.getField(fieldName)?.error
  }
  
  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    return Boolean(this.getFieldError(fieldName))
  }
  
  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this._showPassword = !this._showPassword
  }
  
  /**
   * Get password visibility state
   */
  isPasswordVisible(): boolean {
    return this._showPassword
  }
  
  /**
   * Check if form is currently loading
   */
  isLoading(): boolean {
    return this.formManager.isLoading() || this.authService.isLoading()
  }
  
  /**
   * Get current loading state
   */
  getLoadingState(): LoadingState {
    if (this.authService.isLoading()) {
      return this.authService.getLoadingState()
    }
    return this.formManager.getLoadingState()
  }
  
  /**
   * Reset form to initial state
   */
  reset(): void {
    this.formManager.reset()
    this._showPassword = false
  }
  
  /**
   * Toggle theme between light and dark
   */
  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
  
  /**
   * Get current theme
   */
  getCurrentTheme(): 'light' | 'dark' | 'system' {
    return this.themeService.getTheme()
  }
  
  /**
   * Get resolved theme (actual theme being applied)
   */
  getResolvedTheme(): 'light' | 'dark' {
    return this.themeService.getResolvedTheme()
  }
  
  /**
   * Subscribe to theme changes
   */
  subscribeToTheme(callback: (theme: string, resolvedTheme: string) => void): () => void {
    return this.themeService.subscribe(callback)
  }
  
  /**
   * Subscribe to authentication state changes
   */
  subscribeToAuth(callback: (user: any) => void): () => void {
    return this.authService.subscribe(callback)
  }
  
  /**
   * Set state change handler
   */
  onStateChange(handler: (state: LoadingState) => void): void {
    this._onStateChange = handler
  }
  
  /**
   * Set success handler
   */
  onSuccess(handler: () => void): void {
    this._onSuccess = handler
  }
  
  /**
   * Get form data for debugging or other purposes
   */
  getFormData(): Record<string, string> {
    return this.formManager.getFormData()
  }
  
  /**
   * Get all form errors
   */
  getFormErrors(): Record<string, string> {
    return this.formManager.getFormErrors()
  }
  
  /**
   * Check if form has any validation errors
   */
  hasFormErrors(): boolean {
    return this.formManager.hasErrors()
  }
  
  /**
   * Validate entire form
   */
  validateForm(): boolean {
    return this.formManager.validateForm()
  }
  
  /**
   * Cleanup resources when component unmounts
   */
  dispose(): void {
    // Clean up any subscriptions or resources
    // This would be called in useEffect cleanup
  }
}