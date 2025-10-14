# HR Manager Dashboard - Modular OOP Architecture

## 🏗️ Architecture Overview

This project has been restructured to follow a **modular, object-oriented programming (OOP) architecture** that promotes:

- ✅ **Maintainable Code** - Clear separation of concerns
- ✅ **Testable Components** - Each class can be independently tested  
- ✅ **Reusable Services** - Singleton services shared across components
- ✅ **Type Safety** - Full TypeScript interfaces and implementations
- ✅ **Scalable Structure** - Easy to extend and modify

---

## 📁 **Project Structure**

```
/lib
├── types/
│   └── index.ts                 # Core interfaces and type definitions
├── validation/
│   └── rules.ts                 # Validation rule classes
├── form/
│   └── FormManager.ts           # Form state management class
├── services/
│   ├── AuthService.ts           # Authentication service (Singleton)
│   ├── ThemeService.ts          # Theme management service (Singleton)
│   └── NotificationService.ts   # Notification service (Singleton)
└── controllers/
    └── LoginController.ts       # Login component controller class

/app
├── login/
│   └── page.tsx                 # Login page using OOP controllers
└── dashboard/
    └── page.tsx                 # Dashboard page
```

---

## 🧩 **Core Architecture Patterns**

### 1. **Interface-Driven Design**

All classes implement well-defined interfaces for consistency and testability:

```typescript
// Core interfaces define contracts
export interface IAuthProvider {
  signIn(credentials: IAuthCredentials): Promise<IAuthResult>
  signInWithGoogle(): Promise<IAuthResult>
  signOut(): Promise<void>
  getCurrentUser(): Promise<IUser | null>
}

// Services implement interfaces
export class AuthService implements IAuthProvider {
  // Implementation...
}
```

### 2. **Singleton Services**

Key services use the Singleton pattern for global state management:

```typescript
export class AuthService implements IAuthProvider {
  private static instance: AuthService | null = null
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }
}

// Usage: Consistent instance across the app
const authService = AuthService.getInstance()
```

### 3. **Controller Pattern**

UI components use controller classes to manage business logic:

```typescript
export class LoginController {
  private formManager: FormManager
  private authService: AuthService
  
  constructor() {
    this.authService = AuthService.getInstance()
    this.setupFormFields()
  }
  
  async submitForm(): Promise<boolean> {
    return await this.formManager.submit()
  }
}
```

### 4. **Composition Over Inheritance**

Services are composed rather than inherited for flexibility:

```typescript
export class LoginController {
  // Compose multiple services
  private authService: AuthService
  private notificationService: NotificationService  
  private themeService: ThemeService
  
  // Clean delegation of responsibilities
}
```

---

## 🔧 **Core Classes & Services**

### **AuthService** (Singleton)
**Purpose:** Centralized authentication management  
**Features:**
- NextAuth.js integration
- Google OAuth handling  
- Session management
- Error handling with user-friendly messages
- Event subscription system

```typescript
const authService = AuthService.getInstance()

// Sign in with credentials
const result = await authService.signIn({
  email: 'user@example.com',
  password: 'password123'
})

// Subscribe to auth changes
const unsubscribe = authService.subscribe((user) => {
  console.log('User changed:', user)
})
```

### **ThemeService** (Singleton)
**Purpose:** Dark/light theme management  
**Features:**
- System theme detection
- Theme persistence to localStorage
- Smooth theme transitions  
- Theme change event system

```typescript
const themeService = ThemeService.getInstance()

// Toggle theme
themeService.toggleTheme()

// Subscribe to theme changes
themeService.subscribe((theme, resolvedTheme) => {
  console.log(`Theme: ${theme}, Resolved: ${resolvedTheme}`)
})
```

### **NotificationService** (Singleton)  
**Purpose:** Centralized notification system  
**Features:**
- Success, error, warning, info notifications
- Loading states with promise handling
- Context-specific notification helpers
- Toast management and cleanup

```typescript
const notificationService = NotificationService.getInstance()

// Show notifications
notificationService.success('Login successful!')
notificationService.error('Authentication failed')

// Auth-specific helpers  
notificationService.auth.signInSuccess('John Doe')
notificationService.auth.signInError('Invalid credentials')
```

### **FormManager**
**Purpose:** Form state and validation management  
**Features:**
- Field-level validation with custom rules
- Form-level state management
- Loading states and error handling  
- Async form submission

```typescript
const formManager = new FormManager()

// Add fields with validation
formManager.addField(new FormField('email', [
  new RequiredValidationRule(),
  new EmailValidationRule()
]))

// Handle submission
formManager.setSubmitHandler(async (data) => {
  await authService.signIn(data)
})

const success = await formManager.submit()
```

### **ValidationRules**
**Purpose:** Reusable field validation logic  
**Features:**
- Composable validation rules
- Custom error messages
- Common validation patterns
- Rule factory for standard combinations

```typescript
// Individual rules
const emailRule = new EmailValidationRule()
const requiredRule = new RequiredValidationRule('Email')

// Composite validation
const emailRules = ValidationRuleFactory.createEmailRules()
const passwordRules = ValidationRuleFactory.createStrongPasswordRules()
```

### **LoginController**
**Purpose:** Login page business logic controller  
**Features:**
- Form management integration
- Service orchestration  
- Event handling and state management
- Clean separation from UI components

```typescript
const controller = new LoginController()

// Setup event handlers
controller.onSuccess(() => router.push('/dashboard'))
controller.onStateChange((state) => setLoadingState(state))

// Handle user actions
await controller.submitForm()
await controller.handleGoogleLogin()
controller.toggleTheme()
```

---

## 🎯 **Benefits of This Architecture**

### **1. Maintainability**
- **Single Responsibility:** Each class has one clear purpose
- **Separation of Concerns:** Business logic separated from UI
- **Clean Interfaces:** Well-defined contracts between components

### **2. Testability** 
- **Unit Testing:** Each service can be tested independently
- **Mocking:** Interface-based design enables easy mocking
- **Isolated Logic:** Business logic separated from React components

### **3. Scalability**
- **Modular Design:** Easy to add new features without affecting existing code  
- **Service Reuse:** Singleton services shared across components
- **Type Safety:** Full TypeScript coverage prevents runtime errors

### **4. Developer Experience**
- **Auto-completion:** Rich IntelliSense support
- **Error Prevention:** Compile-time error detection
- **Clear Architecture:** Easy onboarding for new developers

---

## 🔄 **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React         │    │   Controller     │    │   Services      │
│   Component     │───▶│   (LoginCtrl)    │───▶│   (Singletons)  │
│                 │    │                  │    │                 │
│ - UI State      │    │ - Business Logic │    │ - AuthService   │
│ - Event Handlers│    │ - Form Mgmt      │    │ - ThemeService  │
│ - Rendering     │    │ - Validation     │    │ - NotifyService │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         └─── Event Callbacks ────┴─── Service Events ────┘
```

### **Component Responsibilities:**

**React Component:**
- Render UI elements
- Handle DOM events  
- Manage local UI state
- Subscribe to controller events

**Controller:**
- Coordinate business logic
- Manage form validation
- Handle user interactions
- Orchestrate service calls

**Services:**
- Handle external APIs
- Manage global state
- Provide reusable functionality
- Emit state change events

---

## 🚀 **Usage Examples**

### **Creating a New Form Controller**

```typescript
export class RegistrationController {
  private formManager: FormManager
  private authService: AuthService
  
  constructor() {
    this.authService = AuthService.getInstance()
    this.formManager = new FormManager()
    this.setupFields()
  }
  
  private setupFields(): void {
    this.formManager.addField(new FormField('name', 
      ValidationRuleFactory.createNameRules()
    ))
    this.formManager.addField(new FormField('email',
      ValidationRuleFactory.createEmailRules()  
    ))
    this.formManager.addField(new FormField('password',
      ValidationRuleFactory.createStrongPasswordRules()
    ))
  }
  
  async register(): Promise<boolean> {
    return await this.formManager.submit()
  }
}
```

### **Adding a New Service**

```typescript
export class ApiService {
  private static instance: ApiService | null = null
  private baseURL: string
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }
  
  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
  }
  
  async get<T>(endpoint: string): Promise<T> {
    // Implementation...
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    // Implementation...
  }
}
```

### **Using Services in Components**

```typescript
export default function MyComponent() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const authService = AuthService.getInstance()
    
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(setUser)
    
    // Cleanup subscription
    return unsubscribe
  }, [])
  
  const handleSignOut = async () => {
    const authService = AuthService.getInstance()
    await authService.signOut()
  }
  
  // Component JSX...
}
```

---

## 🧪 **Testing Strategy**

### **Unit Testing Services**

```typescript
describe('AuthService', () => {
  let authService: AuthService
  
  beforeEach(() => {
    // Reset singleton for testing
    AuthService['instance'] = null
    authService = AuthService.getInstance()
  })
  
  it('should sign in with valid credentials', async () => {
    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(result.success).toBe(true)
    expect(result.user).toBeDefined()
  })
})
```

### **Testing Controllers**

```typescript  
describe('LoginController', () => {
  let controller: LoginController
  
  beforeEach(() => {
    controller = new LoginController()
  })
  
  it('should validate form fields', () => {
    controller.setFieldValue('email', 'invalid-email')
    
    const isValid = controller.validateForm()
    expect(isValid).toBe(false)
    expect(controller.hasFieldError('email')).toBe(true)
  })
})
```

---

## 📚 **Best Practices**

### **1. Service Guidelines**
- Keep services focused on single responsibilities  
- Use dependency injection for testability
- Implement proper error handling
- Provide clear public APIs

### **2. Controller Guidelines**  
- Separate business logic from UI logic
- Use composition over inheritance
- Handle async operations properly
- Provide clean event interfaces

### **3. Validation Guidelines**
- Create reusable validation rules
- Combine rules for complex validation  
- Provide clear error messages
- Validate on both client and server

### **4. Type Safety Guidelines**
- Define interfaces for all contracts
- Use generic types where appropriate
- Avoid `any` types
- Leverage TypeScript strict mode

---

## 🔄 **Migration & Evolution**

### **Adding New Features**
1. **Define Interfaces** - Create contracts first
2. **Implement Services** - Build core functionality  
3. **Create Controllers** - Add business logic
4. **Build Components** - Create UI layer
5. **Write Tests** - Ensure quality

### **Refactoring Existing Code**
1. **Identify Responsibilities** - Separate concerns
2. **Extract Services** - Move shared logic  
3. **Create Controllers** - Add business layer
4. **Update Components** - Simplify UI code
5. **Add Type Safety** - Implement interfaces

---

**🎯 This modular OOP architecture provides a solid foundation for building scalable, maintainable React applications with TypeScript, ensuring code quality and developer productivity as the project grows.**