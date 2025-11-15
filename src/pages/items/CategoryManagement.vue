// PAGE PURPOSE: Category and subcategory management interface for organizing marketplace taxonomy
//
// MAIN FUNCTIONALITY:
// - Create, edit, and delete marketplace categories
// - Organize hierarchical category tree (parent → child → grandchild)
// - Manage category attributes and specifications
// - Set category-specific settings (commission rates, rules, templates)
// - Reorder categories and change hierarchy
// - Track category performance (item count, sales, popularity)
// - Manage category images and icons
// - Enable/disable categories
//
// UI COMPONENTS:
// - Category tree view (hierarchical structure with expand/collapse)
// - Category list table (flat view with all categories)
// - Add Category button and modal
// - Edit Category panel/modal
// - Category details view (name, description, parent, icon, settings)
// - Drag-and-drop reordering interface
// - Category performance metrics (items listed, total sales, popularity)
// - Attribute/specification builder (define category-specific fields)
// - Commission rate settings
// - Category status toggle (active/inactive)
// - Delete confirmation modal
// - Bulk category actions
//
// DATA REQUIREMENTS:
// - API: GET /api/admin/categories
// - Response: {
//     categories: [{
//       id, name, slug, description,
//       parentId, level, order,
//       icon, image,
//       status: 'active' | 'inactive',
//       itemCount, totalSales,
//       attributes: [{ name, type, required, options }],
//       settings: { commissionRate, requiresModeration, allowRentals },
//       createdAt, updatedAt
//     }],
//     stats: { totalCategories, activeCategories, totalItems }
//   }
//
// WORKFLOW:
// 1. Display category tree or list
// 2. Admin clicks Add Category
// 3. Fill category details (name, parent, description, icon)
// 4. Define category-specific attributes
// 5. Set category settings
// 6. Save new category
// 7. Category available for item listings
// OR
// 1. Admin selects existing category to edit
// 2. Modify details, attributes, or settings
// 3. Save changes
// 4. Updates reflected across marketplace
//
// CATEGORY HIERARCHY:
// - Three levels: Parent → Child → Grandchild
// - Example:
//   * Electronics (Parent)
//     → Phones (Child)
//       → Smartphones (Grandchild)
//       → Feature Phones (Grandchild)
//     → Computers (Child)
//       → Laptops (Grandchild)
//       → Desktops (Grandchild)
// - Unlimited depth possible (configurable)
// - Visual tree with indentation
//
// ADD CATEGORY FORM:
// - Category Name: Required, unique, 3-50 characters
// - Slug: Auto-generated from name, editable (URL-friendly)
// - Parent Category: Dropdown (optional for top-level categories)
// - Description: Brief description of category (optional)
// - Icon: Upload icon or select from library
// - Image: Category header image (optional)
// - Status: Active/Inactive toggle
// - Display Order: Number (for sorting)
//
// EDIT CATEGORY:
// - Same fields as add category
// - Change parent category (move in hierarchy)
// - Update attributes and settings
// - View category usage (number of items)
// - Cannot delete if items exist (must reassign first)
//
// CATEGORY ATTRIBUTES:
// - Define fields specific to each category
// - Example for "Phones" category:
//   * Brand (text, required)
//   * Storage (dropdown: 64GB, 128GB, 256GB, required)
//   * Color (color picker, optional)
//   * Screen Size (number, optional)
//   * RAM (dropdown: 4GB, 8GB, 16GB, required)
//
// - Attribute types:
//   * Text (free text input)
//   * Number (numeric input with min/max)
//   * Dropdown (predefined options)
//   * Multi-select (multiple choices)
//   * Checkbox (yes/no)
//   * Date (date picker)
//   * Color (color picker)
//
// - Attribute settings:
//   * Required vs Optional
//   * Show in filters (for search/filter panel)
//   * Show in listings (display in item cards)
//   * Predefined options (for dropdowns/multi-select)
//
// CATEGORY SETTINGS:
//
// - COMMISSION RATE:
//   * Platform commission percentage for items in this category
//   * Can override global commission rate
//   * Example: Electronics 10%, Vehicles 5%
//
// - MODERATION REQUIREMENT:
//   * Require admin approval before items go live
//   * High-risk categories (luxury goods, electronics) require moderation
//
// - RENTAL AVAILABILITY:
//   * Allow items in this category to be rented
//   * Some categories only for sale (e.g., consumables)
//
// - MINIMUM PRICE:
//   * Set minimum listing price for category
//   * Prevent unrealistic pricing
//
// - MAXIMUM PRICE:
//   * Set maximum listing price (optional)
//   * Flag overpriced items
//
// - FEATURED ELIGIBILITY:
//   * Allow items in this category to be featured
//
// DRAG-AND-DROP REORDERING:
// - Visual drag handles on category rows
// - Drag to reorder within same level
// - Drag to change parent (move to different level)
// - Visual feedback during drag operation
// - Save order button after reordering
//
// CATEGORY PERFORMANCE METRICS:
// - Total items listed in category
// - Active listings count
// - Total sales revenue from category
// - Average item price
// - Category popularity (views, searches)
// - Growth trend (items added over time)
// - Top sellers in category
//
// CATEGORY IMAGES:
// - Icon: Small icon for navigation menus (SVG or PNG, 32x32)
// - Header Image: Large banner for category pages (1200x400)
// - Upload from computer or select from library
// - Image preview before saving
//
// DELETE CATEGORY:
// - Only if no items currently assigned
// - If items exist, prompt to reassign to different category
// - Confirmation modal: "Are you sure? This cannot be undone"
// - Soft delete option (mark inactive instead of deleting)
// - Audit log deletion with admin identity
//
// BULK CATEGORY ACTIONS:
// - Select multiple categories (checkboxes)
// - Bulk activate/deactivate
// - Bulk delete (if no items)
// - Bulk change parent category
// - Bulk update settings (e.g., set same commission rate)
//
// CATEGORY STATUS:
// - Active: Category visible to users, items can be listed
// - Inactive: Hidden from users, existing items remain but no new listings
// - Use case: Seasonal categories, deprecated categories
//
// SLUG MANAGEMENT:
// - Auto-generated from category name
// - URL-friendly (lowercase, hyphens, no spaces)
// - Must be unique across all categories
// - Example: "Smartphones" → "smartphones", "T-Shirts" → "t-shirts"
// - Used in URLs: /categories/electronics/phones/smartphones
//
// CATEGORY BREADCRUMB PATH:
// - Display full hierarchy path
// - Example: Home > Electronics > Phones > Smartphones
// - Used for navigation and SEO
//
// ATTRIBUTE TEMPLATES:
// - Predefined attribute sets for common categories
// - Electronics template: Brand, Model, Condition, etc.
// - Clothing template: Size, Color, Material, etc.
// - Vehicles template: Make, Model, Year, Mileage, etc.
// - Apply template when creating new category
//
// CATEGORY VALIDATION:
// - Name: Required, unique, 3-50 characters
// - Slug: Required, unique, lowercase, no spaces
// - Parent: Must exist if specified, prevent circular references
// - Attributes: Valid types and settings
// - Commission: 0-100 percentage
//
// SECURITY CONSIDERATIONS:
// - Only Super Admin or users with "category_management" permission
// - Audit log all category changes
// - Prevent accidental deletion of popular categories
// - Require confirmation for destructive actions
//
// PERFORMANCE OPTIMIZATION:
// - Lazy load category tree (expand on demand)
// - Cache category structure
// - Index categories for fast search
//
// ERROR HANDLING:
// - Cannot delete category with items (show item count)
// - Duplicate name/slug validation
// - Circular parent reference prevention
// - Clear error messages for validation failures
//
// RESPONSIVE DESIGN:
// - Tree view collapses to list on mobile
// - Touch-friendly expand/collapse
// - Mobile-optimized forms
//
// INTEGRATION POINTS:
// - Item listing forms use categories and attributes
// - Search/filter panels use category structure
// - Frontend category navigation
// - Analytics track performance by category
// - Commission calculations based on category rates
