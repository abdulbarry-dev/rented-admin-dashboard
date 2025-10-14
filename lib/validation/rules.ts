// ============================================================================
// FORM VALIDATION RULES
// ============================================================================
// Reusable, composable validation rules for form fields
// Each rule is a self-contained class that validates a specific requirement
// ============================================================================

import { IValidationRule } from '@/lib/types'

// ============================================================================
// 📧 EMAIL VALIDATION
// ============================================================================

/**
 * Email Validation Rule
 * 
 * Validates email addresses using a standard RFC-compliant regex pattern.
 * Checks for basic email structure: text@domain.extension
 * 
 * ✅ Valid: user@example.com, john.doe@company.co.uk
 * ❌ Invalid: user@, @example.com, user@domain
 * 
 * Usage:
 * ```typescript
 * const rule = new EmailValidationRule()
 * const isValid = rule.validate('user@example.com') // true
 * ```
 */
export class EmailValidationRule implements IValidationRule {
  /** Standard email regex pattern */
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  /** User-friendly error message */
  public readonly message = 'Please enter a valid email address'
  
  /**
   * Validate email format
   * @param value - The email address to validate
   * @returns true if email format is valid, false otherwise
   */
  validate(value: string): boolean {
    if (!value) return false
    return EmailValidationRule.EMAIL_REGEX.test(value.trim())
  }
}

// ============================================================================
// ✏️ REQUIRED FIELD VALIDATION
// ============================================================================

/**
 * Required Field Validation Rule
 * 
 * Ensures a field contains a value (not empty after trimming whitespace).
 * Most commonly used validation rule for mandatory fields.
 * 
 * ✅ Valid: "John", "  text  " (will be trimmed)
 * ❌ Invalid: "", "   ", null, undefined
 * 
 * Usage:
 * ```typescript
 * const rule = new RequiredValidationRule('Email')
 * const isValid = rule.validate('user@example.com') // true
 * console.log(rule.message) // "Email is required"
 * ```
 */
export class RequiredValidationRule implements IValidationRule {
  /** Dynamic error message including field name */
  public readonly message: string
  
  /**
   * Create a required field rule
   * @param fieldName - Name of the field (used in error message)
   */
  constructor(fieldName = 'This field') {
    this.message = `${fieldName} is required`
  }
  
  /**
   * Validate field has content
   * @param value - The field value to validate
   * @returns true if field has content, false if empty
   */
  validate(value: string): boolean {
    return Boolean(value && value.trim().length > 0)
  }
}

// ============================================================================
// 📏 LENGTH VALIDATION
// ============================================================================

/**
 * Minimum Length Validation Rule
 * 
 * Ensures a field meets minimum character length requirements.
 * Useful for passwords, usernames, descriptions, etc.
 * 
 * ✅ Valid: "password123" (if minLength = 8)
 * ❌ Invalid: "pass" (if minLength = 8)
 * 
 * Usage:
 * ```typescript
 * const rule = new MinLengthValidationRule(8, 'Password')
 * const isValid = rule.validate('mypassword') // true
 * console.log(rule.message) // "Password must be at least 8 characters"
 * ```
 */
export class MinLengthValidationRule implements IValidationRule {
  /** Dynamic error message with length requirement */
  public readonly message: string
  
  /**
   * Create a minimum length rule
   * @param minLength - Minimum number of characters required
   * @param fieldName - Name of the field (used in error message)
   */
  constructor(
    private readonly minLength: number,
    fieldName = 'This field'
  ) {
    this.message = `${fieldName} must be at least ${minLength} characters`
  }
  
  /**
   * Validate minimum length
   * @param value - The field value to validate
   * @returns true if length requirement is met, false otherwise
   */
  validate(value: string): boolean {
    return Boolean(value && value.length >= this.minLength)
  }
  
  /**
   * Get the minimum length requirement
   * @returns The minimum length value
   */
  getMinLength(): number {
    return this.minLength
  }
}

// ============================================================================
// 🔒 PASSWORD STRENGTH VALIDATION
// ============================================================================

/**
 * Password Strength Validation Rule
 * 
 * Validates password complexity using enterprise security standards:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * 
 * ✅ Valid: "MyPass123", "Secure@99"
 * ❌ Invalid: "password" (no uppercase/number), "PASSWORD123" (no lowercase)
 * 
 * Usage:
 * ```typescript
 * const rule = new PasswordStrengthValidationRule()
 * const isValid = rule.validate('MySecurePass123') // true
 * ```
 */
export class PasswordStrengthValidationRule implements IValidationRule {
  /** Detailed error message explaining requirements */
  public readonly message = 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
  
  /**
   * Validate password strength
   * @param value - The password to validate
   * @returns true if all requirements are met, false otherwise
   */
  validate(value: string): boolean {
    if (!value) return false
    
    // Check all requirements
    const hasMinLength = value.length >= 8
    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasNumber = /\d/.test(value)
    
    return hasMinLength && hasUppercase && hasLowercase && hasNumber
  }
  
  /**
   * Get detailed feedback on which requirements are missing
   * @param value - The password to check
   * @returns Object with boolean flags for each requirement
   */
  getStrengthDetails(value: string): {
    hasMinLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    isValid: boolean
  } {
    const hasMinLength = value.length >= 8
    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasNumber = /\d/.test(value)
    
    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber
    }
  }
}

// ============================================================================
// 🔗 COMPOSITE VALIDATION
// ============================================================================

/**
 * Composite Validation Rule
 * 
 * Combines multiple validation rules with AND logic.
 * All rules must pass for the composite rule to pass.
 * 
 * Usage:
 * ```typescript
 * const composite = new CompositeValidationRule([
 *   new RequiredValidationRule('Password'),
 *   new MinLengthValidationRule(8, 'Password'),
 *   new PasswordStrengthValidationRule()
 * ])
 * 
 * const isValid = composite.validate('MyPass123')
 * const failed = composite.getFailedRules('weak') // Get which rules failed
 * ```
 */
export class CompositeValidationRule implements IValidationRule {
  /** Generic error message (use getFailedRules for specific errors) */
  public readonly message: string
  
  /**
   * Create a composite rule
   * @param rules - Array of validation rules to combine
   */
  constructor(private readonly rules: IValidationRule[]) {
    this.message = 'Multiple validation requirements not met'
  }
  
  /**
   * Validate using all rules
   * @param value - The field value to validate
   * @returns true if ALL rules pass, false if ANY rule fails
   */
  validate(value: string): boolean {
    return this.rules.every(rule => rule.validate(value))
  }
  
  /**
   * Get list of rules that failed validation
   * @param value - The field value to validate
   * @returns Array of rules that failed (empty if all passed)
   */
  getFailedRules(value: string): IValidationRule[] {
    return this.rules.filter(rule => !rule.validate(value))
  }
  
  /**
   * Get all error messages from failed rules
   * @param value - The field value to validate
   * @returns Array of error messages from failed rules
   */
  getFailedMessages(value: string): string[] {
    return this.getFailedRules(value).map(rule => rule.message)
  }
}

// ============================================================================
// 🏭 VALIDATION RULE FACTORY
// ============================================================================

/**
 * Validation Rule Factory
 * 
 * Provides pre-configured validation rule combinations for common use cases.
 * Use these factory methods instead of creating rule combinations manually.
 * 
 * Benefits:
 * - Consistent validation across the application
 * - Easy to maintain and update rules
 * - Reduces code duplication
 * 
 * Usage:
 * ```typescript
 * // Instead of manually creating rules:
 * const rules = [new RequiredValidationRule('Email'), new EmailValidationRule()]
 * 
 * // Use the factory:
 * const rules = ValidationRuleFactory.createEmailRules()
 * ```
 */
export class ValidationRuleFactory {
  /**
   * Create standard email field validation
   * Rules: Required + Valid email format
   */
  static createEmailRules(): IValidationRule[] {
    return [
      new RequiredValidationRule('Email'),
      new EmailValidationRule()
    ]
  }
  
  /**
   * Create basic password validation
   * Rules: Required + Minimum 8 characters
   */
  static createPasswordRules(): IValidationRule[] {
    return [
      new RequiredValidationRule('Password'),
      new MinLengthValidationRule(8, 'Password')
    ]
  }
  
  /**
   * Create strong password validation (recommended for new accounts)
   * Rules: Required + Password complexity requirements
   */
  static createStrongPasswordRules(): IValidationRule[] {
    return [
      new RequiredValidationRule('Password'),
      new PasswordStrengthValidationRule()
    ]
  }
  
  /**
   * Create name field validation
   * Rules: Required + Minimum 2 characters
   */
  static createNameRules(): IValidationRule[] {
    return [
      new RequiredValidationRule('Name'),
      new MinLengthValidationRule(2, 'Name')
    ]
  }
  
  /**
   * Create username validation
   * Rules: Required + Minimum 3 characters
   */
  static createUsernameRules(): IValidationRule[] {
    return [
      new RequiredValidationRule('Username'),
      new MinLengthValidationRule(3, 'Username')
    ]
  }
}