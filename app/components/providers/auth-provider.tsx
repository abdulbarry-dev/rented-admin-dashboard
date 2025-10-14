'use client'

import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Simple pass-through provider
 * 
 * Previously used NextAuth SessionProvider, now removed.
 * Authentication is handled via Bearer tokens in localStorage.
 * This component is kept for future auth context if needed.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>
}