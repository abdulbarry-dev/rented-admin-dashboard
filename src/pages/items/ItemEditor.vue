// PAGE PURPOSE: Administrative item editing interface to modify listings without seller intervention
//
// MAIN FUNCTIONALITY:
// - Edit any item field (title, description, price, photos, category, etc.)
// - Upload/delete/reorder item photos
// - Update item specifications and attributes
// - Change item status and availability
// - Set pricing and rental rates
// - Manage categories and tags
// - Preview changes before saving
// - Track edit history and reasons
//
// UI COMPONENTS:
// - Item editor form with sections: Basic Info, Photos, Pricing, Specifications, Availability, Settings
// - Rich text editor for description
// - Photo upload/management interface
// - Category selector (hierarchical dropdown)
// - Pricing inputs (sale price, rental rates, security deposit)
// - Specifications builder (dynamic fields based on category)
// - Tags input (multi-select or autocomplete)
// - Status selector dropdown
// - Availability settings (quantity, rental calendar)
// - Location editor
// - Preview button (see item as users would see it)
// - Save and Cancel buttons
// - Edit reason input (why admin is editing)
// - Validation errors display
//
// DATA REQUIREMENTS:
// - State: itemId, formData, originalData, photos, isLoading, isSaving, validationErrors
// - URL params: itemId (from ItemDetail.vue)
// - API: GET /api/admin/items/:id, PUT /api/admin/items/:id
// - Categories API: GET /api/admin/categories
// - Response: item data, updated item
//
// WORKFLOW:
// 1. Load existing item data
// 2. Populate form with current values
// 3. Admin edits fields as needed
// 4. Upload new photos or delete existing ones
// 5. Validate all inputs
// 6. Preview changes (optional)
// 7. Save changes with edit reason
// 8. Item updated in database
// 9. Seller notified of admin edit
// 10. Redirect to ItemDetail.vue
//
// FORM SECTIONS:
//
// 1. BASIC INFORMATION:
//    - Title (required, max 100 characters)
//    - Description (required, rich text editor, max 5000 characters)
//    - Condition (new, like new, used, fair, poor)
//    - Brand (optional text input)
//    - Model (optional text input)
//
// 2. PHOTOS:
//    - Upload new photos (drag & drop or file picker)
//    - Maximum 10 photos per item
//    - Drag to reorder photos
//    - Delete photo button
//    - Set cover photo (first photo is default)
//    - Photo preview thumbnails
//    - Image validation (format, size, content)
//
// 3. PRICING:
//    - Listing Type: Sale, Rent, or Both
//    - Sale Price (if for sale)
//    - Rental Daily Rate (if for rent)
//    - Rental Weekly Rate (optional discount)
//    - Rental Monthly Rate (optional discount)
//    - Security Deposit (for rentals)
//    - Currency selector
//    - Original Price (for showing discount)
//
// 4. CATEGORY & TAGS:
//    - Category selector (hierarchical tree: Electronics > Phones > iPhone)
//    - Subcategory selection
//    - Tags input (comma-separated or autocomplete)
//    - Suggested tags based on category
//
// 5. SPECIFICATIONS:
//    - Dynamic fields based on selected category
//    - Electronics: Screen size, RAM, storage, etc.
//    - Clothing: Size, material, fit, etc.
//    - Vehicles: Make, model, year, mileage, etc.
//    - Custom key-value pairs for other attributes
//
// 6. AVAILABILITY:
//    - Available quantity (for sales)
//    - Rental calendar (for rentals, block unavailable dates)
//    - Shipping options (ships, local pickup, both)
//    - Delivery time estimate
//
// 7. LOCATION:
//    - City (required)
//    - Country (required)
//    - Coordinates (optional, for map display)
//    - Shipping regions/countries
//
// 8. STATUS & SETTINGS:
//    - Item status (active, pending, delisted, etc.)
//    - Featured item checkbox
//    - Featured duration (if featured)
//    - Allow offers checkbox
//    - Auto-renew listing checkbox
//
// PHOTO MANAGEMENT:
// - Upload photos: Click or drag & drop
// - Supported formats: JPG, PNG, WEBP
// - Max file size: 5MB per photo
// - Image compression and optimization
// - Reorder photos: Drag thumbnails to rearrange
// - Delete photo: X button on thumbnail
// - Cover photo: First photo is default, can change
// - Validation: Check for inappropriate content
//
// RICH TEXT EDITOR (Description):
// - Formatting tools: Bold, italic, underline
// - Lists: Bullet and numbered lists
// - Links: Add hyperlinks
// - Headings: H1, H2, H3
// - Character counter (max 5000)
// - Preview mode
//
// VALIDATION RULES:
// - Title: Required, 5-100 characters
// - Description: Required, 20-5000 characters
// - Photos: At least 1 photo required
// - Category: Required selection
// - Price: Required if listing type is sale, must be > 0
// - Rental rates: At least one rate required if listing type is rent
// - Quantity: Required for sale items, must be > 0
// - Location: City and country required
//
// CATEGORY SELECTION:
// - Hierarchical dropdown tree
// - Example: Electronics → Phones → Smartphones → iPhone
// - Selecting category loads category-specific specification fields
// - Change category: Confirm (may lose specifications)
//
// SPECIFICATIONS BUILDER:
// - Dynamic fields based on category
// - Example for Electronics:
//   * Brand (text)
//   * Screen Size (number with unit)
//   * RAM (dropdown: 4GB, 8GB, 16GB, etc.)
//   * Storage (dropdown: 64GB, 128GB, 256GB, etc.)
// - Example for Clothing:
//   * Size (dropdown: XS, S, M, L, XL, etc.)
//   * Material (text)
//   * Color (color picker or text)
// - Custom fields: Add additional key-value pairs
//
// PRICING CALCULATIONS:
// - Show discount percentage if original price provided
// - Validate rental rates (weekly should be less than 7x daily)
// - Currency conversion preview (if multi-currency supported)
//
// PREVIEW FUNCTIONALITY:
// - Open preview modal showing item as it appears to users
// - Use unsaved form data for preview
// - Test responsive views (desktop, tablet, mobile)
// - Close preview to return to editing
//
// EDIT REASON:
// - Required field: Why is admin editing this item?
// - Reasons:
//   * Correcting user error
//   * Policy compliance
//   * Photo quality improvement
//   * Content moderation
//   * Seller request
//   * Other (with details)
// - Edit reason saved in item history
// - Used for audit trail
//
// SAVE & CANCEL:
// - Save Changes button:
//   * Validate all fields
//   * Show validation errors if any
//   * Confirm save
//   * Update item in database
//   * Log edit in audit trail
//   * Notify seller of changes
//   * Redirect to ItemDetail.vue
//
// - Cancel button:
//   * Confirm discard changes (if any unsaved changes)
//   * Redirect to ItemDetail.vue
//   * Don't save anything
//
// SELLER NOTIFICATION:
// - Send email/in-app notification to seller
// - Inform them item was edited by admin
// - Include edit reason
// - Show what changed (before/after)
// - Allow seller to contact admin if concerns
//
// AUTO-SAVE:
// - Periodically save form data to localStorage
// - Recover draft if browser closes unexpectedly
// - Show "Draft saved" indicator
// - Clear draft after successful save
//
// SECURITY CONSIDERATIONS:
// - Only admins with "item_edit" permission
// - Audit log all edits with full change history
// - Track admin who made edit
// - Prevent editing items in active transactions
// - Validate uploaded photos for appropriate content
//
// PERFORMANCE OPTIMIZATION:
// - Debounce validation (don't validate on every keystroke)
// - Lazy load category tree
// - Compress images on upload
// - Save drafts to localStorage
//
// ERROR HANDLING:
// - Show field-level validation errors
// - Handle image upload failures
// - Network error recovery (save draft)
// - Confirm before leaving page with unsaved changes
//
// RESPONSIVE DESIGN:
// - Single column layout on mobile
// - Touch-friendly inputs
// - Mobile-optimized photo upload
//
// INTEGRATION POINTS:
// - Router: Navigate to ItemDetail.vue after save
// - Store: Cache category data
// - Image Service: Upload and compress photos
// - Notification Service: Notify seller of edit
