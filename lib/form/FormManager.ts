import { IFormField, IValidationRule, LoadingState } from '@/lib/types'

/**
 * Form field class for managing individual form field state and validation
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
  
  /**
   * Update field value and validate if field has been touched
   */
  setValue(value: string): void {
    this.value = value
    if (this._touched) {
      this.validate()
    }
  }
  
  /**
   * Mark field as touched and validate
   */
  markAsTouched(): void {
    this._touched = true
    this.validate()
  }
  
  /**
   * Validate field value against all rules
   */
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
  
  /**
   * Check if field is valid without setting error state
   */
  isValid(): boolean {
    return this.rules.every(rule => rule.validate(this.value))
  }
  
  /**
   * Check if field has been touched by user
   */
  isTouched(): boolean {
    return this._touched
  }
  
  /**
   * Reset field to initial state
   */
  reset(value = ''): void {
    this.value = value
    this.error = undefined
    this._touched = false
  }
}

/**
 * Form manager class for handling multiple form fields and form-level operations
 */
export class FormManager {
  private fields: Map<string, FormField> = new Map()
  private _loadingState: LoadingState = LoadingState.IDLE
  private _submitHandler?: (data: Record<string, string>) => Promise<void>
  private _onStateChange?: (state: LoadingState) => void
  
  /**
   * Add a field to the form
   */
  addField(field: FormField): void {
    this.fields.set(field.name, field)
  }
  
  /**
   * Get a field by name
   */
  getField(name: string): FormField | undefined {
    return this.fields.get(name)
  }
  
  /**
   * Get all field names
   */
  getFieldNames(): string[] {
    return Array.from(this.fields.keys())
  }
  
  /**
   * Set value for a specific field
   */
  setFieldValue(fieldName: string, value: string): void {
    const field = this.fields.get(fieldName)
    if (field) {
      field.setValue(value)
    }
  }
  
  /**
   * Get value for a specific field
   */
  getFieldValue(fieldName: string): string {
    const field = this.fields.get(fieldName)
    return field?.value || ''
  }
  
  /**
   * Mark field as touched
   */
  touchField(fieldName: string): void {
    const field = this.fields.get(fieldName)
    if (field) {
      field.markAsTouched()
    }
  }
  
  /**
   * Validate all fields in the form
   */
  validateForm(): boolean {
    let isValid = true
    
    for (const field of this.fields.values()) {
      if (!field.validate()) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  /**
   * Get all form data as key-value pairs
   */
  getFormData(): Record<string, string> {
    const data: Record<string, string> = {}
    
    for (const [name, field] of this.fields) {
      data[name] = field.value
    }
    
    return data
  }
  
  /**
   * Get all form errors
   */
  getFormErrors(): Record<string, string> {
    const errors: Record<string, string> = {}
    
    for (const [name, field] of this.fields) {
      if (field.error) {
        errors[name] = field.error
      }
    }
    
    return errors
  }
  
  /**
   * Check if form has any errors
   */
  hasErrors(): boolean {
    return Array.from(this.fields.values()).some(field => field.error)
  }
  
  /**
   * Reset entire form to initial state
   */
  reset(): void {
    for (const field of this.fields.values()) {
      field.reset()
    }
    this._loadingState = LoadingState.IDLE
  }
  
  /**
   * Set loading state and notify listeners
   */
  setLoadingState(state: LoadingState): void {
    this._loadingState = state
    this._onStateChange?.(state)
  }
  
  /**
   * Get current loading state
   */
  getLoadingState(): LoadingState {
    return this._loadingState
  }
  
  /**
   * Check if form is currently loading
   */
  isLoading(): boolean {
    return this._loadingState === LoadingState.LOADING
  }
  
  /**
   * Set submit handler for the form
   */
  setSubmitHandler(handler: (data: Record<string, string>) => Promise<void>): void {
    this._submitHandler = handler
  }
  
  /**
   * Set state change listener
   */
  onStateChange(listener: (state: LoadingState) => void): void {
    this._onStateChange = listener
  }
  
  /**
   * Submit the form
   */
  async submit(): Promise<boolean> {
    if (!this._submitHandler) {
      throw new Error('No submit handler defined')
    }
    
    // Mark all fields as touched to show validation errors
    for (const field of this.fields.values()) {
      field.markAsTouched()
    }
    
    if (!this.validateForm()) {
      return false
    }
    
    this.setLoadingState(LoadingState.LOADING)
    
    try {
      await this._submitHandler(this.getFormData())
      this.setLoadingState(LoadingState.SUCCESS)
      return true
    } catch (error) {
      this.setLoadingState(LoadingState.ERROR)
      return false
    }
  }
}