import { signIn, signOut, getSession } from 'next-auth/react'
import { IAuthProvider, IAuthCredentials, IAuthResult, IUser, AuthProvider, LoadingState } from '@/lib/types'
import { toast } from 'sonner'

/**
 * Authentication service class implementing the IAuthProvider interface
 * Handles all authentication operations using NextAuth.js
 */
export class AuthService implements IAuthProvider {
  private static instance: AuthService | null = null
  private _loadingState: LoadingState = LoadingState.IDLE
  private _currentUser: IUser | null = null
  private _listeners: Set<(user: IUser | null) => void> = new Set()
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.initializeSession()
  }
  
  /**
   * Initialize session on service creation
   */
  private async initializeSession(): Promise<void> {
    try {
      const user = await this.getCurrentUser()
      this._currentUser = user
      this.notifyListeners(user)
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }
  
  /**
   * Sign in with email and password credentials
   */
  async signIn(credentials: IAuthCredentials): Promise<IAuthResult> {
    this.setLoadingState(LoadingState.LOADING)
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })
      
      if (result?.error) {
        this.setLoadingState(LoadingState.ERROR)
        return {
          success: false,
          error: this.getErrorMessage(result.error)
        }
      }
      
      const user = await this.getCurrentUser()
      this._currentUser = user
      this.notifyListeners(user)
      this.setLoadingState(LoadingState.SUCCESS)
      
      toast.success('Successfully signed in!')
      
      return {
        success: true,
        user: user || undefined
      }
      
    } catch (error) {
      this.setLoadingState(LoadingState.ERROR)
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      
      toast.error(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }
  
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<IAuthResult> {
    this.setLoadingState(LoadingState.LOADING)
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        this.setLoadingState(LoadingState.ERROR)
        return {
          success: false,
          error: 'Google sign in failed'
        }
      }
      
      const user = await this.getCurrentUser()
      this._currentUser = user
      this.notifyListeners(user)
      this.setLoadingState(LoadingState.SUCCESS)
      
      toast.success('Successfully signed in with Google!')
      
      return {
        success: true,
        user: user || undefined
      }
      
    } catch (error) {
      this.setLoadingState(LoadingState.ERROR)
      const errorMessage = 'Google authentication failed'
      
      toast.error(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }
  
  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: false 
      })
      
      this._currentUser = null
      this.notifyListeners(null)
      this.setLoadingState(LoadingState.IDLE)
      
      toast.success('Successfully signed out')
      
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }
  
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<IUser | null> {
    try {
      const session = await getSession()
      
      if (!session?.user) {
        return null
      }
      
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }
      
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }
  
  /**
   * Refresh authentication token (placeholder for future implementation)
   */
  async refreshToken(): Promise<string | null> {
    try {
      // Implement token refresh logic here
      // This would typically call your API to refresh the JWT token
      return null
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }
  
  /**
   * Get current loading state
   */
  getLoadingState(): LoadingState {
    return this._loadingState
  }
  
  /**
   * Check if authentication is in loading state
   */
  isLoading(): boolean {
    return this._loadingState === LoadingState.LOADING
  }
  
  /**
   * Get cached current user (synchronous)
   */
  getCachedUser(): IUser | null {
    return this._currentUser
  }
  
  /**
   * Subscribe to user state changes
   */
  subscribe(listener: (user: IUser | null) => void): () => void {
    this._listeners.add(listener)
    
    // Return unsubscribe function
    return () => {
      this._listeners.delete(listener)
    }
  }
  
  /**
   * Set loading state
   */
  private setLoadingState(state: LoadingState): void {
    this._loadingState = state
  }
  
  /**
   * Notify all listeners of user state changes
   */
  private notifyListeners(user: IUser | null): void {
    this._listeners.forEach(listener => listener(user))
  }
  
  /**
   * Convert NextAuth error codes to user-friendly messages
   */
  private getErrorMessage(error: string): string {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return 'OAuth authentication failed'
      case 'EmailCreateAccount':
        return 'Failed to create account'
      case 'Callback':
        return 'Authentication callback failed'
      case 'OAuthAccountNotLinked':
        return 'Account already exists with different provider'
      case 'EmailSignin':
        return 'Failed to send sign in email'
      case 'CredentialsCreateAccount':
        return 'Failed to create account with credentials'
      case 'SessionRequired':
        return 'Please sign in to continue'
      default:
        return 'Authentication failed'
    }
  }
}

/**
 * Singleton instance export for easy access
 */
export const authService = AuthService.getInstance()