# Middleware Module

Clean, maintainable authentication middleware for Next.js with Laravel Sanctum.

## 📁 Structure

```
lib/middleware/
├── index.ts         # Main export file (import from here)
├── handler.ts       # Core middleware logic
├── utils.ts         # Helper functions
├── config.ts        # Configuration & constants
├── types.ts         # TypeScript types
└── README.md        # Documentation (this file)
```

## 🎯 Purpose

This middleware provides:
- **Authentication checking** - Validates Bearer tokens
- **Access control** - Routes users based on verification status
- **Automatic redirects** - Sends users to appropriate pages
- **Clean separation** - Easy to understand and modify

## 🚀 Quick Start

### Basic Usage

In your root `middleware.ts` file:

```typescript
import { handleAuthMiddleware } from '@/lib/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return handleAuthMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

That's it! The middleware will automatically:
1. Check authentication tokens
2. Fetch user data from Laravel API
3. Apply access control rules
4. Redirect users as needed

## 📋 How It Works

### Flow Diagram

```
Request comes in
  ↓
Check if public route or static file?
  ├─ Yes → Allow access
  └─ No  → Continue
  ↓
Token exists in cookies?
  ├─ No  → Redirect to /login
  └─ Yes → Continue
  ↓
Validate token with Laravel API
  ├─ Invalid → Clear token, redirect to /login
  └─ Valid → Continue
  ↓
Check user status against current route
  ├─ Needs redirect → Redirect to appropriate page
  └─ Access OK → Allow access
```

### Access Control Rules

| User Status | Allowed Routes | Redirected From |
|-------------|---------------|-----------------|
| `pending` | `/verification` | All other routes → `/verification` |
| `verified` | `/dashboard`, most pages | `/verification` → `/dashboard` |
| `banned` | `/banned` only | All other routes → `/banned` |

## 📚 Module Guide

### 1. `config.ts` - Configuration

**What it contains:**
- Route access rules
- Public routes list
- API configuration
- Status-based redirects

**When to modify:**
- Adding new protected routes
- Changing access rules
- Updating API endpoints
- Adding new user statuses

**Example:**
```typescript
export const ROUTE_ACCESS_RULES = {
  '/verification': { 
    allowedStatuses: ['pending'] 
  },
  '/dashboard': { 
    allowedStatuses: ['verified'] 
  },
  '/settings': { 
    allowedStatuses: ['verified'] // Add new route
  },
}
```

### 2. `types.ts` - TypeScript Types

**What it contains:**
- User data interface
- API response types
- Validation result types
- Redirect decision types

**When to modify:**
- User data structure changes
- New fields added to API response
- New validation scenarios

**Example:**
```typescript
export interface UserData {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
  // Add new fields here
  department?: string
}
```

### 3. `utils.ts` - Helper Functions

**What it contains:**
- `isPublicRoute()` - Check if route is public
- `shouldSkipMiddleware()` - Check if middleware should skip
- `validateToken()` - Validate token with API
- `getRedirectDecision()` - Determine if redirect needed
- `createLoginRedirect()` - Create login URL

**When to modify:**
- Changing validation logic
- Adding new redirect rules
- Customizing skip conditions

**Example:**
```typescript
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname)
}
```

### 4. `handler.ts` - Main Logic

**What it contains:**
- `handleAuthMiddleware()` - Main middleware function
- Orchestrates all other functions
- Handles logging and responses

**When to modify:**
- Changing overall middleware flow
- Adding custom logging
- Implementing special cases

**Example:**
```typescript
export async function handleAuthMiddleware(request: NextRequest) {
  // 1. Skip check
  // 2. Token check
  // 3. Validate token
  // 4. Check access
  // 5. Redirect or allow
}
```

### 5. `index.ts` - Exports

**What it contains:**
- All exports from other files
- Single import point

**When to modify:**
- After adding new functions
- After adding new types

## 🔧 Common Modifications

### Add a New Protected Route

1. Open `config.ts`
2. Add to `ROUTE_ACCESS_RULES`:

```typescript
export const ROUTE_ACCESS_RULES = {
  // ... existing routes
  '/settings': { 
    allowedStatuses: ['verified'] 
  },
}
```

### Add a New Public Route

1. Open `config.ts`
2. Add to `PUBLIC_ROUTES`:

```typescript
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password', // New public route
]
```

### Change Redirect Logic

1. Open `utils.ts`
2. Modify `getRedirectDecision()`:

```typescript
export function getRedirectDecision(
  userStatus: AdminStatus,
  currentPath: string
): RedirectDecision {
  // Add custom logic here
  if (userStatus === 'verified' && currentPath === '/onboarding') {
    return {
      shouldRedirect: true,
      redirectUrl: '/dashboard',
      reason: 'Onboarding already completed',
    }
  }
  
  // ... rest of logic
}
```

### Add Custom Validation

1. Open `utils.ts`
2. Modify `validateToken()`:

```typescript
export async function validateToken(token: string): Promise<TokenValidationResult> {
  // ... existing validation
  
  // Add custom checks
  if (user.isBlocked) {
    return {
      valid: false,
      error: 'User account is blocked',
    }
  }
  
  return { valid: true, user }
}
```

## 🐛 Debugging

### Enable Verbose Logging

The middleware already logs key events:
- `🔒` - Authentication issues
- `🚦` - Redirects
- `✅` - Access granted
- `❌` - Errors

Check the console during development to see these logs.

### Common Issues

#### Issue: Infinite Redirect Loop

**Cause:** User status doesn't match any valid status.

**Solution:** Check that user.status is one of: `verified`, `pending`, `banned`

```typescript
// In Laravel, ensure status field is correct:
$user->status = 'verified'; // Not 'VERIFIED' or 'Verified'
```

#### Issue: Middleware Not Running

**Cause:** Route not matching the middleware config.

**Solution:** Check `middleware.ts` matcher pattern includes your route.

#### Issue: Token Not Found

**Cause:** Token not stored in cookies.

**Solution:** Ensure login stores token in cookies:
```typescript
document.cookie = `auth_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`
```

## 📖 Examples

### Example 1: Allow Both Verified and Pending

```typescript
// config.ts
export const ROUTE_ACCESS_RULES = {
  '/profile': { 
    allowedStatuses: ['verified', 'pending'] // Both can access
  },
}
```

### Example 2: Custom API Error Handling

```typescript
// utils.ts
export async function validateToken(token: string): Promise<TokenValidationResult> {
  try {
    const response = await fetch(...)
    
    if (response.status === 403) {
      return {
        valid: false,
        error: 'Access forbidden - contact admin',
      }
    }
    
    // ... rest of logic
  } catch (error) {
    // Custom error handling
    return {
      valid: false,
      error: 'Network error - please try again',
    }
  }
}
```

### Example 3: Role-Based Access

```typescript
// utils.ts
export function checkRoleAccess(
  role: AdminRole,
  pathname: string
): boolean {
  // Super admins can access everything
  if (role === 'super') {
    return true
  }
  
  // Moderators can't access /settings
  if (role === 'moderator' && pathname === '/settings') {
    return false
  }
  
  return true
}

// handler.ts
export async function handleAuthMiddleware(request: NextRequest) {
  // ... existing code
  
  // Add role check
  if (!checkRoleAccess(user.role, pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // ... rest of code
}
```

## 🧪 Testing

### Test Authentication Flow

```bash
# 1. Not logged in
curl http://localhost:3000/dashboard
# Expected: Redirect to /login

# 2. Invalid token
curl http://localhost:3000/dashboard \
  -H "Cookie: auth_token=invalid"
# Expected: Redirect to /login

# 3. Valid token, pending status
curl http://localhost:3000/dashboard \
  -H "Cookie: auth_token=valid_pending_token"
# Expected: Redirect to /verification

# 4. Valid token, verified status
curl http://localhost:3000/dashboard \
  -H "Cookie: auth_token=valid_verified_token"
# Expected: Access granted
```

## 📊 Architecture Benefits

### Why This Structure?

✅ **Separation of Concerns**
- Config separate from logic
- Types separate from implementation
- Each file has one responsibility

✅ **Easy to Understand**
- Clear file names
- Well-documented functions
- Logical flow

✅ **Easy to Modify**
- Change config without touching logic
- Add new rules without breaking existing
- Test individual functions

✅ **Type Safe**
- TypeScript types for everything
- IDE autocomplete support
- Catch errors at compile time

✅ **Maintainable**
- New developers can understand quickly
- Clear documentation
- Examples for common tasks

## 🔐 Security Notes

1. **Token Storage**: Tokens stored in httpOnly cookies (safer than localStorage)
2. **Token Validation**: Every request validates token with backend
3. **No Client Trust**: All checks done server-side
4. **Error Handling**: Errors default to denying access
5. **Logging**: Security events logged for audit

## 📝 Checklist for Developers

When working with this middleware:

- [ ] Read this README completely
- [ ] Understand the flow diagram
- [ ] Know which file to modify for your task
- [ ] Test your changes with all user statuses
- [ ] Update types if changing data structures
- [ ] Add comments for complex logic
- [ ] Test redirect scenarios
- [ ] Check console logs during dev

## 🆘 Need Help?

1. Check the flow diagram above
2. Look at the examples section
3. Check common issues in debugging section
4. Review the middleware logs in console
5. Ask senior developers

## 📚 Related Documentation

- `MIDDLEWARE_GUIDE.md` - Complete middleware documentation
- `MIDDLEWARE_QUICK_REF.md` - Quick reference guide
- `BEARER_TOKEN_AUTH.md` - Authentication documentation

---

**Last Updated:** October 15, 2025  
**Maintained By:** Development Team  
**Questions?** Ask in #dev-help channel
