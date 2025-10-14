import { IThemeConfig } from '@/lib/types'

/**
 * ThemeService - Manages light/dark theme
 * 
 * Simple service for theme switching with localStorage persistence
 */
export class ThemeService {
  private static instance: ThemeService | null = null
  private currentTheme: 'light' | 'dark' | 'system' = 'system'
  private resolvedTheme: 'light' | 'dark' = 'light'
  private listeners: Set<(theme: string, resolvedTheme: string) => void> = new Set()
  private config: IThemeConfig
  
  /** Get or create single instance */
  public static getInstance(config?: IThemeConfig): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService(config)
    }
    return ThemeService.instance
  }
  
  private constructor(config?: IThemeConfig) {
    this.config = config || {
      defaultTheme: 'system',
      enableSystem: true,
      attribute: 'class'
    }
    
    this.loadTheme()
    this.watchSystemTheme()
  }
  
  /** Load theme from storage or use default */
  private loadTheme(): void {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    this.currentTheme = stored || this.config.defaultTheme
    
    this.updateResolvedTheme()
    this.applyTheme()
  }
  
  /** Watch for system theme changes */
  private watchSystemTheme(): void {
    if (typeof window === 'undefined' || !this.config.enableSystem) return
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.updateResolvedTheme()
        this.applyTheme()
        this.notifyListeners()
      }
    })
  }
  
  /** Update resolved theme based on system or current setting */
  private updateResolvedTheme(): void {
    if (this.currentTheme === 'system') {
      this.resolvedTheme = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      this.resolvedTheme = this.currentTheme
    }
  }
  
  /** Apply theme to document */
  private applyTheme(): void {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(this.resolvedTheme)
  }
  
  /** Set theme and save to storage */
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentTheme = theme
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
    this.updateResolvedTheme()
    this.applyTheme()
    this.notifyListeners()
  }
  
  /** Get current theme setting */
  getTheme(): 'light' | 'dark' | 'system' {
    return this.currentTheme
  }
  
  /** Get actual theme being shown */
  getResolvedTheme(): 'light' | 'dark' {
    return this.resolvedTheme
  }
  
  /** Toggle theme */
  toggleTheme(): void {
    const newTheme = this.currentTheme === 'system'
      ? (this.resolvedTheme === 'dark' ? 'light' : 'dark')
      : (this.currentTheme === 'dark' ? 'light' : 'dark')
    this.setTheme(newTheme)
  }
  
  /** Check if system theme is enabled */
  isSystemThemeEnabled(): boolean {
    return this.config.enableSystem
  }
  
  /** Get system theme preference */
  getSystemTheme(): 'light' | 'dark' {
    return typeof window !== 'undefined' && 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  /** Subscribe to theme changes */
  subscribe(listener: (theme: string, resolvedTheme: string) => void): () => void {
    this.listeners.add(listener)
    listener(this.currentTheme, this.resolvedTheme)
    return () => this.listeners.delete(listener)
  }
  
  /** Notify all subscribers */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme, this.resolvedTheme))
  }
  
  /** Get config */
  getConfig(): IThemeConfig {
    return { ...this.config }
  }
  
  /** Update config */
  updateConfig(config: Partial<IThemeConfig>): void {
    this.config = { ...this.config, ...config }
    if (config.defaultTheme && this.currentTheme === 'system') {
      this.loadTheme()
    }
  }
}

export const themeService = ThemeService.getInstance()