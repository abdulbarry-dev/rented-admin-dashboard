This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:
- `NEXTAUTH_SECRET`: Generate a secure secret for JWT signing
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Your Google OAuth credentials

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Access the Login Page

Visit [http://localhost:3000/login](http://localhost:3000/login) to see the modern login interface with:
- ✅ Dark/Light theme support
- ✅ Google OAuth integration  
- ✅ Mobile-responsive design
- ✅ Professional UI matching the HR dashboard aesthetic

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Dependencies

This project depends on several runtime and development packages. Below is a concise explanation of each dependency in `package.json` and why we use it.

### Runtime dependencies

- `next` — The Next.js framework powering the app (routing, SSR/SSG, build tooling).
- `react`, `react-dom` — React library and DOM renderer used by Next.js.
- `@tanstack/react-query` — Data-fetching, caching and synchronization library for server state.
- `@tanstack/react-query-devtools` — Developer tools for inspecting `react-query` cache and queries.
- `axios` — Promise-based HTTP client for calling APIs.
- `react-hook-form` — Lightweight form state management library for React.
- `@hookform/resolvers` — Integration adapters (resolvers) for `react-hook-form` to use schema validators like `zod`.
- `zod` — Type-safe schema validation used to validate and parse user/input data.
- `next-auth` — Authentication library for Next.js (provider support, sessions).
- `next-themes` — Theme (dark/light) management for Next.js apps.
- `react-hot-toast` — Minimal toast notification library for user feedback.
- `recharts` — Simple charting library for React used to render graphs and visualizations.
- `lucide-react` — An icon component library used for UI icons.
- `date-fns` — Small, modular date utility functions for parsing/formatting dates.
- `numeral` — Number and currency formatting utilities.
- `js-cookie` — Browser cookie helper for setting and reading cookies.
- `clsx` — Utility for conditionally joining classNames.
- `class-variance-authority` — Small utility to manage and compose className variants (useful with Tailwind).
- `tailwind-merge` — Safely merge Tailwind CSS className strings without duplication/conflicts.
- `zustand` — Simple and lightweight global state management.

#### Enterprise-Grade UI Components (Radix UI)

- `@radix-ui/react-accordion` — Accessible collapsible content sections for organizing information.
- `@radix-ui/react-alert-dialog` — Modal dialogs for critical confirmations and destructive actions.
- `@radix-ui/react-avatar` — User profile images with automatic fallbacks and status indicators.
- `@radix-ui/react-checkbox` — Accessible form checkboxes with indeterminate states.
- `@radix-ui/react-collapsible` — Expandable sections for progressive disclosure.
- `@radix-ui/react-context-menu` — Right-click context menus for enhanced user interactions.
- `@radix-ui/react-dialog` — Modal overlays for forms, confirmations, and detailed views.
- `@radix-ui/react-dropdown-menu` — Feature-rich dropdown menus with keyboard navigation.
- `@radix-ui/react-hover-card` — Rich preview cards that appear on hover for additional context.
- `@radix-ui/react-label` — Accessible form labels with proper associations.
- `@radix-ui/react-menubar` — Application-level menu bars for navigation and actions.
- `@radix-ui/react-navigation-menu` — Complex navigation structures with nested menus.
- `@radix-ui/react-popover` — Floating content containers for tooltips and popovers.
- `@radix-ui/react-progress` — Progress indicators for loading states and task completion.
- `@radix-ui/react-radio-group` — Mutually exclusive option groups with keyboard navigation.
- `@radix-ui/react-scroll-area` — Custom scrollable areas with consistent cross-browser styling.
- `@radix-ui/react-select` — Feature-rich select inputs with search and multi-select capabilities.
- `@radix-ui/react-separator` — Visual dividers for content organization.
- `@radix-ui/react-slider` — Range sliders for numeric input and filtering.
- `@radix-ui/react-switch` — Toggle switches for boolean settings and preferences.
- `@radix-ui/react-tabs` — Tabbed interfaces for organizing related content.
- `@radix-ui/react-toast` — Non-intrusive notification system for user feedback.
- `@radix-ui/react-toggle` — Toggle buttons for binary state controls.
- `@radix-ui/react-toggle-group` — Groups of toggle buttons for multi-select options.
- `@radix-ui/react-toolbar` — Action toolbars with grouped controls and separators.
- `@radix-ui/react-tooltip` — Contextual help and additional information on hover.
- `@radix-ui/react-aspect-ratio` — Responsive containers that maintain aspect ratios.
- `@radix-ui/react-form` — Advanced form handling with validation and error states.
- `@radix-ui/react-visually-hidden` — Content hidden visually but available to screen readers.
- `@radix-ui/colors` — Comprehensive color system with semantic naming and accessibility.

#### Additional Enterprise Tools

- `cmdk` — Command palette component for power users and keyboard shortcuts.
- `vaul` — Modern drawer/bottom sheet component for mobile-first interactions.
- `sonner` — Beautiful toast notification system with stacking and positioning.

### Development dependencies

- `typescript` — Adds TypeScript support and type checking.
- `@types/*` packages (`@types/node`, `@types/react`, `@types/react-dom`, `@types/js-cookie`, `@types/numeral`) — Type definitions for various runtime libs.
- `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/postcss` — Tailwind CSS and PostCSS toolchain for utility-first styling.
- `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `eslint-config-prettier` — Linting and recommended ESLint configs for Next.js and formatting compatibility.
- `prettier`, `prettier-plugin-tailwindcss` — Code formatter and Tailwind-specific formatting plugin.

If you'd like, I can expand this section with example usage of the main libraries (for example, a short `react-query` example, `react-hook-form` usage, or how authentication is wired with `next-auth`).

## Quick Start Guide

### Enterprise UI Components

With the newly installed Radix UI components, you can now build professional dashboard interfaces:

```tsx
// Import any Radix UI component
import * as Dialog from "@radix-ui/react-dialog"
import * as Select from "@radix-ui/react-select" 
import * as Toast from "@radix-ui/react-toast"

// Use in your components
export function EmployeeModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Add Employee</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>New Employee</Dialog.Title>
        {/* Your form content */}
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

### Command Palette (Ctrl+K)

```tsx
import { Command } from "cmdk"

export function CommandPalette() {
  return (
    <Command>
      <Command.Input placeholder="Search..." />
      <Command.List>
        <Command.Item>Search Employees</Command.Item>
        <Command.Item>View Reports</Command.Item>
      </Command.List>
    </Command>
  )
}
```

### Notifications

```tsx
import { toast } from "sonner"

// Show success notification  
toast.success("Employee created successfully!")

// Show error notification
toast.error("Failed to save changes")
```

## 📚 Documentation

- **`hr-dashboard-docs.md`** - Comprehensive technical documentation and HR-specific examples
- **`DESIGN_SYSTEM.md`** - Complete design system, UI guidelines, and implementation rules
- **`LOGIN_PAGE_DOCS.md`** - Detailed login page implementation guide

## Architecture Notes

This project is configured for enterprise-scale development with:

- ✅ **Type Safety** — Full TypeScript support across all components
- ✅ **Accessibility** — WCAG 2.1 AA compliant with Radix UI primitives  
- ✅ **Performance** — Tree-shaking and code splitting with Next.js
- ✅ **Developer Experience** — ESLint, Prettier, and hot reload
- ✅ **Design System** — Consistent styling with Tailwind CSS and Radix colors
- ✅ **State Management** — Optimistic updates with React Query and Zustand
