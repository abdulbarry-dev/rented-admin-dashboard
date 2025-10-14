// ============================================================================
// FORM MANAGEMENT SYSTEM - Refactored for Clarity
// ============================================================================

import { IFormField, IValidationRule, LoadingState } from '@/lib/types'

/**
 * FormField - Manages individual form field state
 * 
 * Handles:
 * - Value storage
 * - Validation with multiple rules
 * - Touch state tracking
 * - Error messaging
 */
export class FormField implements IFormField {
  public name: string
  public value: string
  public error?: string
  public rules: IValidationRule[]
  private _touched: boolean = false
  
  constructor(name: string, rules: IValidationRule[], initialValue = '') {
    this.name = name
    this.value = initialValue
    this.rules = rules
  }
  
  /** Update value and validate if field was touched */
  setValue(value: string): void {
    this.value = value
    if (this._touched) {
      this.validate()
    }
  }
  
  /** Mark as touched and trigger validation */
  markAsTouched(): void {
    this._touched = true
    this.validate()
  }
  
  /** Validate value against all rules */
  validate(): boolean {
    this.error = undefined
    
    for (const rule of this.rules) {
      if (!rule.validate(this.value)) {
        this.error = rule.message
        return false
      }
    }
    
    return true
  }
  
  /** Check validity without setting errors */
  isValid(): boolean {
    return this.rules.every(rule => rule.validate(this.value))
  }
  
  isTouched(): boolean {
    return this._touched
  }
  
  /** Reset to clean state */
  reset(value = ''): void {
    this.value = value
    this.error = undefined
    this._touched = false
  }
}

/**
 * FormManager - Orchestrates multiple form fields
 * 
 * Features:
 * - Multi-field management
 * - Form-level validation
 * - Loading state tracking
 * - Submit handling
 */
export class FormManager {
  private fields: Map<string, FormField> = new Map()
  private _loadingState: LoadingState = LoadingState.IDLE
  private _submitHandler?: (data: Record<string, string>) => Promise<void>
  private _onStateChange?: (state: LoadingState) => void
  
  /** Add a new field to the form */
  addField(field: FormField): void {
    this.fields.set(field.name, field)
  }
  
  /** Get field by name */
  getField(name: string): FormField | undefined {
    return this.fields.get(name)
  }
  
  /** Get all field names */
  getFieldNames(): string[] {
    return Array.from(this.fields.keys())
  }
  
  /** Set value for specific field */
  setFieldValue(fieldName: string, value: string): void {
    const field = this.fields.get(fieldName)
    if (field) {
      field.setValue(value)
    }
  }
  
  /** Get value from specific field */
  getFieldValue(fieldName: string): string {
    const field = this.fields.get(fieldName)
    return field?.value || ''
  }
  
  /** Get error from specific field */
  getFieldError(fieldName: string): string | undefined {
    const field = this.fields.get(fieldName)
    return field?.error
  }
  
  /** Check if field has error */
  hasFieldError(fieldName: string): boolean {
    return Boolean(this.getFieldError(fieldName))
  }
  
  /** Mark field as touched */
  touchField(fieldName: string): void {
    const field = this.fields.get(fieldName)
    if (field) {
      field.markAsTouched()
    }
  }
  
  /** Validate all fields */
  validateForm(): boolean {
    let isValid = true
    
    for (const field of this.fields.values()) {
      if (!field.validate()) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  /** Check if form is valid without setting errors */
  isValid(): boolean {
    return Array.from(this.fields.values()).every(field => field.isValid())
  }
  
  /** Get all form data as object */
  getFormData(): Record<string, string> {
    const data: Record<string, string> = {}
    
    for (const [name, field] of this.fields) {
      data[name] = field.value
    }
    
    return data
  }
  
  /** Get all form errors */
  getFormErrors(): Record<string, string> {
    const errors: Record<string, string> = {}
    
    for (const [name, field] of this.fields) {
      if (field.error) {
        errors[name] = field.error
      }
    }
    
    return errors
  }
  
  /** Check if any field has errors */
  hasErrors(): boolean {
    return Array.from(this.fields.values()).some(field => field.error)
  }
  
  /** Reset all fields */
  reset(): void {
    for (const field of this.fields.values()) {
      field.reset()
    }
    this._loadingState = LoadingState.IDLE
  }
  
  /** Update loading state */
  setLoadingState(state: LoadingState): void {
    this._loadingState = state
    this._onStateChange?.(state)
  }
  
  /** Get current loading state */
  getLoadingState(): LoadingState {
    return this._loadingState
  }
  
  /** Check if currently loading */
  isLoading(): boolean {
    return this._loadingState === LoadingState.LOADING
  }
  
  /** Set handler for form submission */
  setSubmitHandler(handler: (data: Record<string, string>) => Promise<void>): void {
    this._submitHandler = handler
  }
  
  /** Set listener for state changes */
  onStateChange(listener: (state: LoadingState) => void): void {
    this._onStateChange = listener
  }
  
  /**
   * Submit form
   * Returns true if successful, false if validation failed or submission error
   */
  async submit(): Promise<boolean> {
    if (!this._submitHandler) {
      throw new Error('FormManager: No submit handler defined')
    }
    
    // Touch all fields to show errors
    for (const field of this.fields.values()) {
      field.markAsTouched()
    }
    
    // Validate
    if (!this.validateForm()) {
      return false
    }
    
    // Submit
    this.setLoadingState(LoadingState.LOADING)
    
    try {
      await this._submitHandler(this.getFormData())
      this.setLoadingState(LoadingState.SUCCESS)
      return true
    } catch (error) {
      this.setLoadingState(LoadingState.ERROR)
      console.error('FormManager submission failed:', error)
      return false
    }
  }
}
