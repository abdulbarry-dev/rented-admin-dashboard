// ============================================================================
// HR DASHBOARD - CORE TYPE SYSTEM
// ============================================================================
// Central type definitions that power the entire application
// This file defines all interfaces, enums, and contracts used across services
// ============================================================================

// ============================================================================
// 🎭 USER & ROLE DEFINITIONS
// ============================================================================

/**
 * User Role Enumeration
 * 
 * Defines the access control hierarchy in the system.
 * Each role has different permissions and capabilities.
 * 
 * Usage Example:
 * ```typescript
 * if (user.role === UserRole.ADMIN) {
 *   // Show admin panel
 * }
 * ```
 */
export enum UserRole {
  /** Full system access - can manage all users and settings */
  ADMIN = 'admin',
  
  /** HR department access - can manage employees and departments */
  HR_MANAGER = 'hr_manager',
  
  /** Standard user access - can view own data and submit requests */
  EMPLOYEE = 'employee',
  
  /** Limited read-only access - cannot modify any data */
  GUEST = 'guest'
}

/**
 * User Interface
 * 
 * Represents a complete user entity in the system.
 * Contains all user information and metadata.
 * 
 * @property {string} id - Unique identifier (UUID or database ID)
 * @property {string} [name] - Display name (e.g., "John Doe")
 * @property {string} [email] - Email address for login and notifications
 * @property {string} [image] - Profile picture URL
 * @property {UserRole} [role] - Access level (defaults to EMPLOYEE)
 * @property {string} [department] - Department assignment (e.g., "Engineering")
 * @property {Date} [createdAt] - Account creation timestamp
 * @property {Date} [updatedAt] - Last profile update timestamp
 */
export interface IUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: UserRole
  department?: string
  createdAt?: Date
  updatedAt?: Date
}

// ============================================================================
// 🔐 AUTHENTICATION TYPES
// ============================================================================

/**
 * Authentication Provider Enum
 * 
 * Lists all supported authentication methods.
 * Add new providers here as they are implemented.
 */
export enum AuthProvider {
  /** Traditional email + password authentication */
  CREDENTIALS = 'credentials',
  
  /** Google OAuth 2.0 authentication */
  GOOGLE = 'google',
  
  /** Microsoft Azure AD authentication */
  MICROSOFT = 'microsoft'
}

/**
 * Authentication Credentials
 * 
 * User input for credential-based login.
 * Accepts email or phone number for authentication.
 * 
 * @property {string} login - User's email address or phone number
 * @property {string} password - User's password (plain text - will be hashed)
 * @property {boolean} [rememberMe] - Keep user logged in for extended period
 */
export interface IAuthCredentials {
  login: string
  password: string
  rememberMe?: boolean
}

/**
 * Authentication Result
 * 
 * Standardized response for all authentication operations.
 * Provides consistent error handling and success feedback.
 * 
 * @property {boolean} success - True if authentication succeeded
 * @property {IUser} [user] - User data if successful
 * @property {string} [error] - Error code if failed (e.g., 'INVALID_CREDENTIALS')
 * @property {string} [token] - JWT token for API authentication
 */
export interface IAuthResult {
  success: boolean
  user?: IUser
  error?: string
  token?: string
}

/**
 * Authentication Provider Contract
 * 
 * Defines the interface that all authentication services must implement.
 * Ensures consistent behavior across different auth methods.
 * 
 * Implementation Example:
 * ```typescript
 * class AuthService implements IAuthProvider {
 *   async signIn(credentials: IAuthCredentials): Promise<IAuthResult> {
 *     // Implementation
 *   }
 * }
 * ```
 */
export interface IAuthProvider {
  /**
   * Sign in with email and password
   * @param credentials - User's login credentials
   * @returns Promise resolving to authentication result
   */
  signIn(credentials: IAuthCredentials): Promise<IAuthResult>
  
  /**
   * Sign out current user and clear session
   * @returns Promise that resolves when sign out is complete
   */
  signOut(): Promise<void>
  
  /**
   * Get currently authenticated user
   * @returns Promise resolving to user or null if not authenticated
   */
  getCurrentUser(): Promise<IUser | null>
  
  /**
   * Refresh authentication token
   * @returns Promise resolving to new token or null if refresh failed
   */
  refreshToken(): Promise<string | null>
}

/**
 * Authentication Event
 * 
 * Represents an authentication state change event.
 * Used for tracking and responding to auth changes.
 * 
 * @property {string} type - Type of authentication event
 * @property {IUser} [user] - User involved in the event
 * @property {Date} timestamp - When the event occurred
 */
export interface IAuthEvent {
  type: 'sign_in' | 'sign_out' | 'session_update'
  user?: IUser
  timestamp: Date
}

// ============================================================================
// ✅ VALIDATION TYPES
// ============================================================================

/**
 * Validation Rule Contract
 * 
 * Defines a single validation rule that can be applied to form fields.
 * Rules are composable and reusable.
 * 
 * Usage Example:
 * ```typescript
 * const emailRule: IValidationRule = {
 *   validate: (value) => /\S+@\S+\.\S+/.test(value),
 *   message: 'Please enter a valid email address'
 * }
 * ```
 */
export interface IValidationRule {
  /**
   * Validation function
   * @param value - The value to validate
   * @returns True if valid, false otherwise
   */
  validate(value: string): boolean
  
  /**
   * Error message shown when validation fails
   */
  message: string
}

/**
 * Form Field Interface
 * 
 * Represents a single form field with validation.
 * Tracks value, errors, and validation rules.
 * 
 * @property {string} name - Unique field identifier (e.g., 'email', 'password')
 * @property {string} value - Current field value
 * @property {string} [error] - Current error message (if any)
 * @property {IValidationRule[]} rules - Array of validation rules to apply
 */
export interface IFormField {
  name: string
  value: string
  error?: string
  rules: IValidationRule[]
}

// ============================================================================
// 🎨 THEME & UI CONFIGURATION
// ============================================================================

/**
 * Theme Configuration
 * 
 * Controls the appearance and behavior of the theme system.
 * Supports light, dark, and system-based themes.
 */
export interface IThemeConfig {
  /** Default theme to use */
  defaultTheme: 'light' | 'dark' | 'system'
  
  /** Allow automatic system theme detection */
  enableSystem: boolean
  
  /** HTML attribute to set (usually 'class' or 'data-theme') */
  attribute: string
}

/**
 * Toast Notification Configuration
 * 
 * Controls the appearance and behavior of toast notifications.
 */
export interface IToastConfig {
  /** Screen position for toast notifications */
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  /** How long toasts stay visible (milliseconds) */
  duration: number
  
  /** Use colored icons for different toast types */
  richColors: boolean
}

// ============================================================================
// 🔄 APPLICATION STATE
// ============================================================================

/**
 * Loading State Enum
 * 
 * Represents the current state of an async operation.
 * Use this to manage UI feedback during API calls.
 * 
 * Usage Example:
 * ```typescript
 * const [state, setState] = useState(LoadingState.IDLE)
 * setState(LoadingState.LOADING)
 * // Show loading spinner
 * setState(LoadingState.SUCCESS)
 * // Show success message
 * ```
 */
export enum LoadingState {
  /** No operation in progress */
  IDLE = 'idle',
  
  /** Operation in progress */
  LOADING = 'loading',
  
  /** Operation completed successfully */
  SUCCESS = 'success',
  
  /** Operation failed with error */
  ERROR = 'error'
}

// ============================================================================
// ⚙️ APPLICATION CONFIGURATION
// ============================================================================

/**
 * Application Configuration
 * 
 * Central configuration object for the entire application.
 * Contains all settings and feature flags.
 */
export interface IAppConfig {
  /** Authentication settings */
  auth: {
    /** Enabled authentication providers */
    providers: AuthProvider[]
    
    /** Session timeout in minutes */
    sessionTimeout: number
    
    /** "Remember me" duration in days */
    rememberMeDuration: number
  }
  
  /** Theme configuration */
  theme: IThemeConfig
  
  /** Notification configuration */
  toast: IToastConfig
  
  /** API configuration */
  api: {
    /** Base URL for API calls */
    baseUrl: string
    
    /** Request timeout in milliseconds */
    timeout: number
  }
}