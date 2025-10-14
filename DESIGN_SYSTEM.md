# HR Manager Dashboard - Design System & UI Guidelines

## 📖 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Component Design Patterns](#component-design-patterns)
6. [Theme System](#theme-system)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Animation & Motion](#animation--motion)
9. [Iconography](#iconography)
10. [Form Design Patterns](#form-design-patterns)
11. [Data Visualization](#data-visualization)
12. [Mobile Design Principles](#mobile-design-principles)
13. [Implementation Guidelines](#implementation-guidelines)

---

## 🎯 Design Philosophy

### Core Principles

**1. Professional Excellence**
- Clean, modern aesthetic suitable for enterprise environments
- Minimal cognitive load with clear information hierarchy  
- Consistent visual language across all interfaces

**2. User-Centric Design**
- Intuitive navigation and workflows
- Accessible to users of all abilities
- Efficient task completion paths

**3. Scalable Architecture**
- Modular component system
- Consistent design tokens
- Future-proof design decisions

**4. Performance-First**
- Optimized for fast load times
- Smooth interactions and animations
- Efficient resource usage

---

## 🎨 Color System

### Primary Palette

```css
/* Brand Colors */
--violet-500: #8B5CF6    /* Primary brand color */
--violet-600: #7C3AED    /* Primary hover state */
--violet-700: #6D28D9    /* Primary active state */
--purple-500: #A855F7    /* Secondary brand color */
--purple-600: #9333EA    /* Secondary hover state */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)
--gradient-hover: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)
```

### Semantic Colors

```css
/* Light Theme */
--background: rgb(255, 255, 255)        /* Pure white background */
--foreground: rgb(15, 23, 42)          /* Near-black text */
--card: rgb(255, 255, 255)             /* Card backgrounds */
--card-foreground: rgb(15, 23, 42)     /* Card text */
--muted: rgb(241, 245, 249)            /* Subtle backgrounds */
--muted-foreground: rgb(100, 116, 139) /* Secondary text */
--border: rgb(226, 232, 240)           /* Subtle borders */

/* Dark Theme */
--background: rgb(2, 6, 23)            /* Deep navy background */
--foreground: rgb(248, 250, 252)       /* Near-white text */
--card: rgb(15, 23, 42)                /* Card backgrounds */
--card-foreground: rgb(248, 250, 252)  /* Card text */
--muted: rgb(30, 41, 59)               /* Subtle backgrounds */
--muted-foreground: rgb(148, 163, 184) /* Secondary text */
--border: rgb(51, 65, 85)              /* Subtle borders */
```

### Status Colors

```css
/* Success */
--success: rgb(34, 197, 94)     /* Green for positive actions */
--success-bg: rgb(240, 253, 244) /* Light green backgrounds */

/* Error */
--error: rgb(239, 68, 68)       /* Red for errors and warnings */
--error-bg: rgb(254, 242, 242)  /* Light red backgrounds */

/* Warning */
--warning: rgb(245, 158, 11)    /* Amber for warnings */
--warning-bg: rgb(255, 251, 235) /* Light amber backgrounds */

/* Info */
--info: rgb(59, 130, 246)       /* Blue for information */
--info-bg: rgb(239, 246, 255)   /* Light blue backgrounds */
```

### Usage Guidelines

**✅ Do:**
- Use primary violet/purple for CTAs and key actions
- Maintain 4.5:1 contrast ratio minimum
- Use semantic colors for status indicators
- Stick to the defined palette for consistency

**❌ Don't:**
- Mix different color systems within the same interface
- Use colors purely for decoration
- Rely on color alone to convey information
- Use more than 3-4 colors in a single component

---

## ✍️ Typography

### Font Stack

```css
/* Primary Font */
font-family: var(--font-geist-sans), 
             'Inter', 
             'Segoe UI', 
             system-ui, 
             sans-serif;

/* Monospace Font */
font-family: var(--font-geist-mono), 
             'Fira Code', 
             'SF Mono', 
             'Monaco', 
             monospace;
```

### Typography Scale

```css
/* Display Text */
--text-5xl: 3rem     /* 48px - Page titles */
--text-4xl: 2.25rem  /* 36px - Section headers */
--text-3xl: 1.875rem /* 30px - Card titles */
--text-2xl: 1.5rem   /* 24px - Subsection headers */
--text-xl: 1.25rem   /* 20px - Large body text */

/* Body Text */
--text-base: 1rem    /* 16px - Default body text */
--text-sm: 0.875rem  /* 14px - Small body text */
--text-xs: 0.75rem   /* 12px - Captions, labels */

/* Line Heights */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

### Typography Hierarchy

**1. Page Titles (H1)**
```css
font-size: 2.25rem;
font-weight: 700;
line-height: 1.25;
color: var(--foreground);
```

**2. Section Headers (H2)**
```css
font-size: 1.875rem;
font-weight: 600;
line-height: 1.3;
color: var(--foreground);
```

**3. Subsection Headers (H3)**
```css
font-size: 1.5rem;
font-weight: 600;
line-height: 1.4;
color: var(--foreground);
```

**4. Body Text**
```css
font-size: 1rem;
font-weight: 400;
line-height: 1.5;
color: var(--foreground);
```

**5. Secondary Text**
```css
font-size: 0.875rem;
font-weight: 400;
line-height: 1.5;
color: var(--muted-foreground);
```

---

## 📐 Layout & Spacing

### Spacing Scale

```css
/* Base unit: 4px */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

### Grid System

**Container Widths:**
```css
/* Breakpoints */
--container-sm: 640px    /* Mobile landscape */
--container-md: 768px    /* Tablet */
--container-lg: 1024px   /* Desktop */
--container-xl: 1280px   /* Large desktop */
--container-2xl: 1536px  /* Extra large */

/* Max widths */
--max-w-prose: 65ch      /* Readable text width */
--max-w-content: 1200px  /* Main content area */
```

**Layout Patterns:**
- **12-column grid** for complex layouts
- **Flexbox** for component-level alignment
- **CSS Grid** for dashboard card arrangements
- **Container queries** for responsive components

### Border Radius

```css
--radius-sm: 0.25rem   /* 4px - Small elements */
--radius: 0.5rem       /* 8px - Default */
--radius-md: 0.75rem   /* 12px - Cards */
--radius-lg: 1rem      /* 16px - Modals */
--radius-xl: 1.5rem    /* 24px - Hero elements */
--radius-full: 9999px  /* Fully rounded */
```

---

## 🧩 Component Design Patterns

### Button Hierarchy

**1. Primary Button**
```tsx
// High emphasis - main actions
<button className="bg-gradient-to-r from-violet-500 to-purple-600 
                   hover:from-violet-600 hover:to-purple-700 
                   text-white font-semibold py-3 px-6 rounded-xl 
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                   transition-all duration-200">
  Primary Action
</button>
```

**2. Secondary Button**
```tsx
// Medium emphasis - secondary actions
<button className="border border-border bg-background hover:bg-muted 
                   text-foreground font-medium py-3 px-6 rounded-xl 
                   transition-colors duration-200">
  Secondary Action
</button>
```

**3. Ghost Button**
```tsx
// Low emphasis - tertiary actions
<button className="text-muted-foreground hover:text-foreground 
                   hover:bg-muted font-medium py-2 px-4 rounded-lg 
                   transition-colors duration-200">
  Ghost Action
</button>
```

### Card Components

**Basic Card Pattern:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
  <h3 className="text-xl font-semibold text-card-foreground mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card content goes here
  </p>
</div>
```

**Interactive Card:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-sm 
                hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 
                transition-all duration-200 cursor-pointer">
  {/* Card content */}
</div>
```

### Form Components

**Input Field Pattern:**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-foreground">
    Field Label
  </label>
  <input 
    className="w-full px-4 py-3 rounded-xl border border-input 
               bg-background text-foreground placeholder-muted-foreground 
               focus:outline-none focus:ring-2 focus:ring-violet-500 
               focus:border-transparent transition-all duration-200"
    placeholder="Enter value"
  />
</div>
```

---

## 🌓 Theme System

### Theme Architecture

**CSS Custom Properties Approach:**
- Base colors defined as RGB values without `rgb()`
- Dynamic theme switching via CSS classes
- Smooth transitions between themes
- System preference detection

**Theme Provider Implementation:**
```tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider 
  attribute="class"
  defaultTheme="system"
  enableSystem={true}
  disableTransitionOnChange={false}
>
  {children}
</ThemeProvider>
```

### Light Theme Characteristics
- **Background:** Pure white (#FFFFFF)
- **Cards:** White with subtle shadows
- **Text:** Dark slate (#0F172A)
- **Borders:** Light gray (#E2E8F0)
- **Accent:** Violet gradients for brand elements

### Dark Theme Characteristics
- **Background:** Deep navy (#020617)
- **Cards:** Dark slate (#0F172A) with subtle highlights
- **Text:** Near white (#F8FAFC)
- **Borders:** Medium slate (#334155)
- **Accent:** Brighter violet for better contrast

### Theme Toggle Component
```tsx
<button
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  className="p-3 rounded-full bg-card border border-border 
             hover:bg-muted transition-colors duration-200"
>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

---

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast:**
- **Normal text:** Minimum 4.5:1 ratio
- **Large text:** Minimum 3:1 ratio
- **UI components:** Minimum 3:1 ratio for borders and states

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order throughout the interface
- Skip links for main content areas

**Screen Reader Support:**
```tsx
// Proper ARIA labeling
<button aria-label="Toggle theme between light and dark mode">
  {/* Icon */}
</button>

// Hidden content for screen readers
<span className="sr-only">Loading...</span>

// Landmark roles
<nav role="navigation" aria-label="Main navigation">
<main role="main" aria-label="Main content">
```

**Focus Management:**
```css
/* Visible focus indicators */
.focus-visible:focus {
  outline: 2px solid var(--violet-500);
  outline-offset: 2px;
}

/* Remove default browser focus */
.focus-visible:focus:not(.focus-visible) {
  outline: none;
}
```

---

## 🎭 Animation & Motion

### Motion Principles

**1. Purposeful Motion**
- Animations should guide user attention
- Provide feedback for user actions
- Enhance perceived performance

**2. Natural Physics**
- Use easing curves that feel natural
- Respect user motion preferences
- Keep durations appropriate to context

**3. Performance First**
- Prefer CSS transforms over layout changes
- Use `transform` and `opacity` for smooth animations
- Implement `will-change` sparingly

### Animation Library

**Micro-interactions:**
```css
/* Button hover */
.button-hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-out;
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Timing Functions:**
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Duration Guidelines:**
- **Micro-interactions:** 150-200ms
- **Component transitions:** 200-300ms
- **Page transitions:** 300-500ms
- **Loading states:** 500ms+

---

## 🎯 Iconography

### Icon System

**Lucide React Implementation:**
```tsx
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'

// Standard size (24px)
<User className="w-6 h-6" />

// Small size (16px)
<Settings className="w-4 h-4" />

// Large size (32px)
<LogOut className="w-8 h-8" />
```

**Icon Guidelines:**
- **Consistent sizing:** Use predefined size classes
- **Color harmony:** Icons inherit text color by default
- **Semantic usage:** Choose icons that clearly represent their function
- **Accessibility:** Always provide alternative text context

**Icon Sizes:**
```css
--icon-xs: 12px   /* Inline with small text */
--icon-sm: 16px   /* Standard UI elements */
--icon-base: 20px /* Default size */
--icon-lg: 24px   /* Prominent elements */
--icon-xl: 32px   /* Hero elements */
```

### Brand Icons

**Logo Usage:**
```tsx
// Primary logo mark
<div className="inline-flex items-center justify-center w-12 h-12 
                rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 
                shadow-lg">
  <span className="text-white font-bold text-xl">HR</span>
</div>

// Compact version
<div className="w-8 h-8 rounded-lg bg-gradient-to-br 
                from-violet-500 to-purple-600">
  <span className="text-white text-sm font-bold">HR</span>
</div>
```

---

## 📝 Form Design Patterns

### Input Components

**Text Input:**
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-foreground">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-3 rounded-xl border border-input 
               bg-background text-foreground placeholder-muted-foreground 
               focus:outline-none focus:ring-2 focus:ring-violet-500 
               focus:border-transparent disabled:opacity-50 
               disabled:cursor-not-allowed transition-all duration-200"
    placeholder="john@company.com"
  />
</div>
```

**Select Dropdown (Radix UI):**
```tsx
<Select.Root>
  <Select.Trigger className="w-full px-4 py-3 rounded-xl border border-input 
                             bg-background text-foreground 
                             focus:outline-none focus:ring-2 focus:ring-violet-500">
    <Select.Value placeholder="Select option" />
    <Select.Icon>
      <ChevronDown className="w-4 h-4" />
    </Select.Icon>
  </Select.Trigger>
  
  <Select.Portal>
    <Select.Content className="bg-popover border border-border rounded-lg 
                              shadow-lg overflow-hidden">
      <Select.Item value="option1" className="px-4 py-3 hover:bg-muted">
        Option 1
      </Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

**Checkbox/Switch:**
```tsx
// Checkbox
<Checkbox.Root className="w-5 h-5 rounded border-2 border-input 
                         data-[state=checked]:bg-violet-500 
                         data-[state=checked]:border-violet-500">
  <Checkbox.Indicator>
    <Check className="w-3 h-3 text-white" />
  </Checkbox.Indicator>
</Checkbox.Root>

// Switch
<Switch.Root className="w-11 h-6 bg-input rounded-full 
                        data-[state=checked]:bg-violet-500">
  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full 
                          shadow-sm transform transition-transform 
                          data-[state=checked]:translate-x-5" />
</Switch.Root>
```

### Form Validation

**Error States:**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-foreground">
    Password
  </label>
  <input 
    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${hasError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-input focus:ring-violet-500'
                }`}
  />
  {hasError && (
    <p className="text-sm text-red-600 flex items-center space-x-2">
      <AlertCircle className="w-4 h-4" />
      <span>This field is required</span>
    </p>
  )}
</div>
```

**Success States:**
```tsx
<div className="flex items-center space-x-2 text-green-600">
  <CheckCircle className="w-4 h-4" />
  <span className="text-sm">Email verified successfully</span>
</div>
```

---

## 📊 Data Visualization

### Chart Design Principles

**Color Scheme:**
```css
/* Chart colors - accessible palette */
--chart-1: #8B5CF6  /* Primary violet */
--chart-2: #06B6D4  /* Cyan */
--chart-3: #10B981  /* Emerald */
--chart-4: #F59E0B  /* Amber */
--chart-5: #EF4444  /* Red */
--chart-6: #8B5A2B  /* Brown */
```

**Typography for Charts:**
- **Title:** 18px, font-weight: 600
- **Axis labels:** 12px, font-weight: 400
- **Legend:** 14px, font-weight: 500
- **Tooltips:** 12px, font-weight: 400

**Accessibility in Charts:**
- Provide alternative text descriptions
- Use patterns in addition to colors
- Ensure sufficient color contrast
- Include data tables as alternatives

### Dashboard Cards

**Metric Card Pattern:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-muted-foreground">
      Total Employees
    </h3>
    <Users className="w-5 h-5 text-muted-foreground" />
  </div>
  
  <div className="space-y-2">
    <p className="text-3xl font-bold text-foreground">12,600</p>
    <p className="text-sm text-green-600 flex items-center space-x-1">
      <TrendingUp className="w-4 h-4" />
      <span>+2% from last quarter</span>
    </p>
  </div>
</div>
```

---

## 📱 Mobile Design Principles

### Responsive Breakpoints

```css
/* Mobile first approach */
.component {
  /* Mobile styles (default) */
}

@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1280px) {
  /* Large desktop styles */
}
```

### Touch Target Guidelines

**Minimum Touch Targets:**
- **Buttons:** 44px × 44px minimum
- **Form inputs:** 48px height minimum
- **Navigation items:** 44px × 44px minimum
- **Spacing:** 8px minimum between touch targets

**Mobile Optimizations:**
```tsx
// Larger padding for mobile
<button className="py-3 px-6 sm:py-2 sm:px-4 
                   rounded-xl text-base sm:text-sm">
  Mobile Friendly Button
</button>

// Stack on mobile, inline on desktop
<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```

### Mobile Navigation Patterns

**Drawer Navigation:**
```tsx
// Using Radix UI Dialog for mobile menu
<Dialog.Root>
  <Dialog.Trigger className="lg:hidden p-2">
    <Menu className="w-6 h-6" />
  </Dialog.Trigger>
  
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed left-0 top-0 h-full w-80 bg-background 
                              border-r border-border p-6">
      {/* Navigation content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## 🛠 Implementation Guidelines

### CSS Architecture

**Utility-First with Tailwind:**
```css
/* Component-specific styles when needed */
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Component Composition

**Compound Components Pattern:**
```tsx
// Card compound component
const Card = {
  Root: ({ children, className, ...props }) => (
    <div className={`bg-card border border-border rounded-lg ${className}`} {...props}>
      {children}
    </div>
  ),
  
  Header: ({ children, className, ...props }) => (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  ),
  
  Content: ({ children, className, ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Usage
<Card.Root>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Card content</p>
  </Card.Content>
</Card.Root>
```

### Performance Best Practices

**CSS Optimization:**
- Use Tailwind's purge functionality
- Minimize custom CSS when possible
- Leverage CSS custom properties for theming
- Avoid deeply nested selectors

**Component Optimization:**
```tsx
// Lazy loading for route components
const Dashboard = lazy(() => import('./Dashboard'))

// Memoize expensive components
const Chart = memo(({ data }) => {
  return <ExpensiveChart data={data} />
})

// Optimize re-renders with useMemo/useCallback
const MemoizedComponent = () => {
  const expensiveValue = useMemo(() => computeExpensiveValue(), [deps])
  const handleClick = useCallback(() => {}, [deps])
  
  return <Component value={expensiveValue} onClick={handleClick} />
}
```

### Design Token Usage

**Consistent Spacing:**
```tsx
// Use predefined spacing scale
<div className="p-4 m-6 space-y-4">  {/* 16px, 24px, 16px */}

// Prefer semantic spacing
<div className="p-card-padding m-section-margin"> {/* Custom properties */}
```

**Color Usage:**
```tsx
// Use semantic color names
<div className="bg-card text-card-foreground border-border">

// Avoid hardcoded colors
<div className="bg-slate-100"> {/* ❌ Avoid */}
<div className="bg-muted">     {/* ✅ Prefer */}
```

---

## 📋 Design Checklist

### Before Implementation
- [ ] Color contrast meets WCAG AA standards
- [ ] Typography scale is consistent
- [ ] Spacing follows the 4px grid system
- [ ] Components work in both themes
- [ ] Mobile responsiveness is considered
- [ ] Accessibility requirements are met

### Component Review
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Loading and error states are designed
- [ ] Hover and active states are defined
- [ ] Animation duration is appropriate

### Code Quality
- [ ] Semantic HTML structure
- [ ] Proper TypeScript types
- [ ] Consistent naming conventions
- [ ] Performance optimizations applied
- [ ] Cross-browser compatibility tested
- [ ] Documentation is updated

---

## 🔄 Evolution & Maintenance

### Design System Versioning

**Major Changes (v2.0.0):**
- Breaking changes to component APIs
- Significant color palette updates
- Typography system overhauls

**Minor Changes (v1.1.0):**
- New component additions
- Non-breaking feature enhancements
- Additional theme variants

**Patch Changes (v1.0.1):**
- Bug fixes
- Accessibility improvements
- Minor visual refinements

### Feedback Integration

**Design Reviews:**
- Weekly component audits
- User feedback incorporation
- Performance metric monitoring
- Accessibility testing results

**Continuous Improvement:**
- A/B testing for key interactions
- User research findings integration
- Industry best practice adoption
- Technology stack updates

---

**🎨 This design system serves as the single source of truth for all UI decisions in the HR Manager Dashboard, ensuring consistency, accessibility, and scalability across the entire application.**