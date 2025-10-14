import { IAuthProvider, IAuthCredentials, IAuthResult, IUser, LoadingState } from '@/lib/types'
import { login, logout, getCurrentUser, isAuthenticated } from '@/lib/auth'
import { toast } from 'sonner'

/**
 * AuthService - Handles user authentication with Bearer token
 * 
 * Simple singleton service for login, logout, and session management
 * Uses Laravel backend API with Bearer token authentication
 */
export class AuthService implements IAuthProvider {
  private static instance: AuthService | null = null
  private currentUser: IUser | null = null
  private loadingState: LoadingState = LoadingState.IDLE
  private listeners: Set<(user: IUser | null) => void> = new Set()
  
  /** Get or create the single instance */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }
  
  private constructor() {
    this.loadSession()
  }
  
  /** Load current session on startup */
  private async loadSession(): Promise<void> {
    if (isAuthenticated()) {
      const user = await this.getCurrentUser()
      this.currentUser = user
      this.notifyListeners(user)
    }
  }
  
  /** Sign in with email and password */
  async signIn(credentials: IAuthCredentials): Promise<IAuthResult> {
    this.loadingState = LoadingState.LOADING
    
    console.log('🔑 AuthService.signIn - RECEIVED credentials:', credentials)
    console.log('🔑 AuthService.signIn - credentials.login:', credentials.login)
    console.log('🔑 AuthService.signIn - credentials.password:', credentials.password)
    console.log('🔑 AuthService.signIn - credentials.rememberMe:', credentials.rememberMe)
    
    try {
      const loginPayload = {
        login: credentials.login,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }
      
      console.log('📤 AuthService.signIn - SENDING to login():', loginPayload)
      
      const result = await login(loginPayload)
      
      console.log('📦 AuthService.signIn - login result:', result)
      
      if (!result.success) {
        this.loadingState = LoadingState.ERROR
        const errorMessage = result.message || 'Login failed'
        toast.error(errorMessage, {
          description: 'Please check your credentials and try again',
          duration: 4000,
        })
        return { success: false, error: errorMessage }
      }
      
      // Update current user
      if (result.user) {
        this.currentUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          image: result.user.image,
          role: result.user.role as any, // Convert from string to UserRole
        }
      } else {
        this.currentUser = null
      }
      
      this.notifyListeners(this.currentUser)
      this.loadingState = LoadingState.SUCCESS
      
      toast.success(result.message || 'Successfully signed in!')
      return { 
        success: true, 
        user: this.currentUser || undefined,
        token: result.token,
      }
      
    } catch (error) {
      this.loadingState = LoadingState.ERROR
      const message = error instanceof Error ? error.message : 'Sign in failed'
      toast.error('Login Failed', {
        description: message,
        duration: 4000,
      })
      return { success: false, error: message }
    }
  }
  
  /** Sign out current user */
  async signOut(): Promise<void> {
    try {
      await logout()
      
      this.currentUser = null
      this.notifyListeners(null)
      this.loadingState = LoadingState.IDLE
      
      toast.success('Successfully signed out')
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Sign out failed:', error)
      toast.error('Failed to sign out')
    }
  }
  
  /** Get current authenticated user */
  async getCurrentUser(): Promise<IUser | null> {
    try {
      const user = getCurrentUser()
      if (!user) return null
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }
  
  /** Refresh auth token (not implemented for Laravel Bearer tokens) */
  async refreshToken(): Promise<string | null> {
    return null
  }
  
  /** Get loading state */
  getLoadingState(): LoadingState {
    return this.loadingState
  }
  
  /** Check if loading */
  isLoading(): boolean {
    return this.loadingState === LoadingState.LOADING
  }
  
  /** Get cached user without async call */
  getCachedUser(): IUser | null {
    return this.currentUser
  }
  
  /** Subscribe to user changes */
  subscribe(listener: (user: IUser | null) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  
  /** Notify all subscribers */
  private notifyListeners(user: IUser | null): void {
    this.listeners.forEach(listener => listener(user))
  }
}

export const authService = AuthService.getInstance()