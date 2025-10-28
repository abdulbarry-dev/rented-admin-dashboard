# Frontend Stack

A production-ready Next.js frontend with TypeScript, TailwindCSS, shadcn/ui, and modern state management.

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Form Validation**: Zod + React Hook Form
- **API Client**: Custom typed client

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles & theme
│   └── examples/          # Example pages
├── components/
│   ├── ui/                # shadcn/ui components
│   └── examples/          # Example components
├── lib/
│   ├── api-client.ts      # Typed API client
│   └── validation.ts      # Zod schemas
├── store/                 # Zustand stores
│   ├── theme-store.ts
│   └── user-store.ts
├── hooks/                 # Custom React hooks
│   └── use-api.ts
└── types/                 # TypeScript types
\`\`\`

## Getting Started

### Installation

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

## Features

- ✅ Type-safe API client
- ✅ Form validation with Zod
- ✅ State management with Zustand
- ✅ Data fetching with React Query
- ✅ Responsive design with TailwindCSS
- ✅ Dark mode support
- ✅ Example components and pages

## API Integration

The project includes a typed API client for seamless Laravel backend integration:

\`\`\`typescript
import { apiClient } from '@/lib/api-client'

// GET request
const users = await apiClient.get('/users')

// POST request
const newUser = await apiClient.post('/users', { name: 'John' })

// PUT request
const updated = await apiClient.put('/users/1', { name: 'Jane' })

// DELETE request
await apiClient.delete('/users/1')
\`\`\`

## Validation

Use Zod schemas for type-safe validation:

\`\`\`typescript
import { loginSchema } from '@/lib/validation'

const result = loginSchema.parse(data)
\`\`\`

## State Management

Use Zustand stores for global state:

\`\`\`typescript
import { useUserStore } from '@/store/user-store'

const { user, setUser } = useUserStore()
\`\`\`

## License

MIT
