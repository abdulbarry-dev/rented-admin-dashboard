import { signIn, signOut, getSession } from 'next-auth/react'
import { IAuthProvider, IAuthCredentials, IAuthResult, IUser, LoadingState } from '@/lib/types'
import { toast } from 'sonner'

/**
 * AuthService - Handles user authentication
 * 
 * Simple singleton service for login, logout, and session management
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
    const user = await this.getCurrentUser()
    this.currentUser = user
    this.notifyListeners(user)
  }
  
  /** Sign in with email and password */
  async signIn(credentials: IAuthCredentials): Promise<IAuthResult> {
    this.loadingState = LoadingState.LOADING
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })
      
      if (result?.error) {
        this.loadingState = LoadingState.ERROR
        toast.error(this.getErrorMessage(result.error))
        return { success: false, error: this.getErrorMessage(result.error) }
      }
      
      const user = await this.getCurrentUser()
      this.currentUser = user
      this.notifyListeners(user)
      this.loadingState = LoadingState.SUCCESS
      
      toast.success('Successfully signed in!')
      return { success: true, user: user || undefined }
      
    } catch (error) {
      this.loadingState = LoadingState.ERROR
      const message = error instanceof Error ? error.message : 'Sign in failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }
  
  /** Sign in with Google OAuth */
  async signInWithGoogle(): Promise<IAuthResult> {
    this.loadingState = LoadingState.LOADING
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        this.loadingState = LoadingState.ERROR
        toast.error('Google sign in failed')
        return { success: false, error: 'Google sign in failed' }
      }
      
      const user = await this.getCurrentUser()
      this.currentUser = user
      this.notifyListeners(user)
      this.loadingState = LoadingState.SUCCESS
      
      toast.success('Successfully signed in with Google!')
      return { success: true, user: user || undefined }
      
    } catch (error) {
      this.loadingState = LoadingState.ERROR
      toast.error('Google authentication failed')
      return { success: false, error: 'Google authentication failed' }
    }
  }
  
  /** Sign out current user */
  async signOut(): Promise<void> {
    try {
      await signOut({ callbackUrl: '/login', redirect: false })
      
      this.currentUser = null
      this.notifyListeners(null)
      this.loadingState = LoadingState.IDLE
      
      toast.success('Successfully signed out')
    } catch (error) {
      console.error('Sign out failed:', error)
      toast.error('Failed to sign out')
    }
  }
  
  /** Get current authenticated user from session */
  async getCurrentUser(): Promise<IUser | null> {
    try {
      const session = await getSession()
      if (!session?.user) return null
      
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }
  
  /** Refresh auth token (placeholder) */
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
  
  /** Convert error codes to friendly messages */
  private getErrorMessage(error: string): string {
    const messages: Record<string, string> = {
      'CredentialsSignin': 'Invalid email or password',
      'OAuthSignin': 'OAuth authentication failed',
      'OAuthCallback': 'OAuth authentication failed',
      'OAuthCreateAccount': 'OAuth authentication failed',
      'OAuthAccountNotLinked': 'Account exists with different provider',
      'SessionRequired': 'Please sign in to continue',
    }
    return messages[error] || 'Authentication failed'
  }
}

export const authService = AuthService.getInstance()