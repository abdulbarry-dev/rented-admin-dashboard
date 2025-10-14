import { IThemeConfig } from '@/lib/types'

/**
 * Theme configuration and management service
 * Handles theme switching, persistence, and system theme detection
 */
export class ThemeService {
  private static instance: ThemeService | null = null
  private _currentTheme: 'light' | 'dark' | 'system' = 'system'
  private _resolvedTheme: 'light' | 'dark' = 'light'
  private _listeners: Set<(theme: string, resolvedTheme: string) => void> = new Set()
  private _config: IThemeConfig
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(config?: IThemeConfig): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService(config)
    }
    return ThemeService.instance
  }
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor(config?: IThemeConfig) {
    this._config = config || {
      defaultTheme: 'system',
      enableSystem: true,
      attribute: 'class'
    }
    
    this.initializeTheme()
    this.setupSystemThemeListener()
  }
  
  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    this._currentTheme = stored || this._config.defaultTheme
    
    this.updateResolvedTheme()
    this.applyTheme()
  }
  
  /**
   * Setup listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined' || !this._config.enableSystem) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (this._currentTheme === 'system') {
        this.updateResolvedTheme()
        this.applyTheme()
        this.notifyListeners()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
  }
  
  /**
   * Update resolved theme based on current theme and system preference
   */
  private updateResolvedTheme(): void {
    if (this._currentTheme === 'system') {
      if (typeof window !== 'undefined') {
        this._resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
    } else {
      this._resolvedTheme = this._currentTheme
    }
  }
  
  /**
   * Apply theme to document element
   */
  private applyTheme(): void {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    if (this._config.attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(this._resolvedTheme)
    } else {
      root.setAttribute(this._config.attribute, this._resolvedTheme)
    }
  }
  
  /**
   * Set theme and persist to localStorage
   */
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this._currentTheme = theme
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
    
    this.updateResolvedTheme()
    this.applyTheme()
    this.notifyListeners()
  }
  
  /**
   * Get current theme setting
   */
  getTheme(): 'light' | 'dark' | 'system' {
    return this._currentTheme
  }
  
  /**
   * Get resolved theme (actual theme being applied)
   */
  getResolvedTheme(): 'light' | 'dark' {
    return this._resolvedTheme
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    if (this._currentTheme === 'system') {
      // If currently system, toggle to opposite of current resolved theme
      this.setTheme(this._resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      // Toggle between light and dark
      this.setTheme(this._currentTheme === 'dark' ? 'light' : 'dark')
    }
  }
  
  /**
   * Check if system theme detection is enabled
   */
  isSystemThemeEnabled(): boolean {
    return this._config.enableSystem
  }
  
  /**
   * Get system theme preference
   */
  getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  
  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (theme: string, resolvedTheme: string) => void): () => void {
    this._listeners.add(listener)
    
    // Call immediately with current state
    listener(this._currentTheme, this._resolvedTheme)
    
    // Return unsubscribe function
    return () => {
      this._listeners.delete(listener)
    }
  }
  
  /**
   * Notify all listeners of theme changes
   */
  private notifyListeners(): void {
    this._listeners.forEach(listener => {
      listener(this._currentTheme, this._resolvedTheme)
    })
  }
  
  /**
   * Get theme configuration
   */
  getConfig(): IThemeConfig {
    return { ...this._config }
  }
  
  /**
   * Update theme configuration
   */
  updateConfig(config: Partial<IThemeConfig>): void {
    this._config = { ...this._config, ...config }
    
    if (config.defaultTheme && this._currentTheme === 'system') {
      this.initializeTheme()
    }
  }
}

/**
 * Singleton instance export for easy access
 */
export const themeService = ThemeService.getInstance()