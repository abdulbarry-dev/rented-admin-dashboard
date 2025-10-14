/**
 * Login Page Constants
 * 
 * Centralized constants for the login page.
 * Helps maintain consistency and makes updates easier.
 */

export const LOGIN_PAGE_CONTENT = {
  title: 'Welcome Back',
  subtitle: 'Sign in to your HR Manager account',
  submitButton: 'Sign In',
  submitButtonLoading: 'Signing in...',
  forgotPassword: 'Forgot password?',
  signUpPrompt: "Don't have an account?",
  signUpLink: 'Sign up here',
} as const

export const APP_INFO = {
  name: 'HR Manager',
  tagline: 'Admin Dashboard',
} as const

export const FORM_FIELDS = {
  email: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'your.email@company.com',
    type: 'email',
  },
  password: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
  rememberMe: {
    name: 'rememberMe',
    label: 'Remember me',
  },
} as const

export const ROUTES = {
  dashboard: '/dashboard',
  register: '/register',
  login: '/login',
} as const
