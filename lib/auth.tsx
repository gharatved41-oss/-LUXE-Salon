'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'customer' | 'staff' | 'admin'

export interface AuthUser {
  userId: string
  name: string
  email: string
  username?: string
  phone?: string
  role: UserRole
  token: string
  status: 'active' | 'inactive'
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isSigningIn: boolean
  authError: string | null
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<boolean>
  registerCustomer: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock Account Database (Role is securely derived from account record)
const MOCK_USER_DATABASE: Array<AuthUser & { passwordHash: string }> = [
  {
    userId: 'usr-cust-101',
    name: 'Rahul Sharma',
    email: 'rahul@customer.com',
    username: 'rahul',
    phone: '+91 98901 23456',
    role: 'customer',
    token: 'jwt-token-customer-rahul-2026',
    status: 'active',
    passwordHash: 'password123',
  },
  {
    userId: 'usr-stf-201',
    name: 'Suresh Kumar',
    email: 'suresh@salonops.com',
    username: 'suresh',
    phone: '+91 98112 23344',
    role: 'staff',
    token: 'jwt-token-staff-suresh-2026',
    status: 'active',
    passwordHash: 'password123',
  },
  {
    userId: 'usr-adm-301',
    name: 'Aarav Patel',
    email: 'admin@salonops.com',
    username: 'admin',
    phone: '+91 98000 11223',
    role: 'admin',
    token: 'jwt-token-admin-aarav-2026',
    status: 'active',
    passwordHash: 'password123',
  },
  {
    userId: 'usr-inact-401',
    name: 'Pooja Verma',
    email: 'inactive@salonops.com',
    username: 'inactive',
    phone: '+91 98777 66554',
    role: 'customer',
    token: 'jwt-token-inactive-2026',
    status: 'inactive',
    passwordHash: 'password123',
  },
]

const SESSION_STORAGE_KEY = 'salonops_auth_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Load session on startup
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (savedSession) {
        const parsed = JSON.parse(savedSession)
        setUser(parsed)
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = () => setAuthError(null)

  // Common Login Authenticator
  const login = async (emailOrUsername: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsSigningIn(true)
    setAuthError(null)

    // Simulate realistic network round-trip & authentication verification
    await new Promise((resolve) => setTimeout(resolve, 650))

    const cleanInput = emailOrUsername.trim().toLowerCase()
    const foundUser = MOCK_USER_DATABASE.find(
      (u) =>
        (u.email.toLowerCase() === cleanInput || u.username?.toLowerCase() === cleanInput) &&
        u.passwordHash === password
    )

    if (!foundUser) {
      setIsSigningIn(false)
      // Generic error to prevent email enumeration
      setAuthError('Invalid email/username or password.')
      return false
    }

    if (foundUser.status === 'inactive') {
      setIsSigningIn(false)
      setAuthError('Your account is currently inactive. Please contact the administrator.')
      return false
    }

    // Role identification: extracted safely from verified account record
    const authenticatedSession: AuthUser = {
      userId: foundUser.userId,
      name: foundUser.name,
      email: foundUser.email,
      username: foundUser.username,
      phone: foundUser.phone,
      role: foundUser.role,
      token: foundUser.token,
      status: foundUser.status,
    }

    setUser(authenticatedSession)

    try {
      const targetStorage = rememberMe ? localStorage : sessionStorage
      targetStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authenticatedSession))
    } catch {
      // Storage unavailable
    }

    setIsSigningIn(false)
    return true
  }

  // Customer Self-Registration (Only customers can register publicly)
  const registerCustomer = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setIsSigningIn(true)
    setAuthError(null)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const cleanEmail = email.trim().toLowerCase()
    const existing = MOCK_USER_DATABASE.find((u) => u.email.toLowerCase() === cleanEmail)
    if (existing) {
      setIsSigningIn(false)
      setAuthError('An account with this email already exists.')
      return false
    }

    const newCustomerSession: AuthUser = {
      userId: `usr-cust-${Date.now().toString().slice(-4)}`,
      name,
      email: cleanEmail,
      phone,
      role: 'customer',
      token: `jwt-token-customer-${Date.now()}`,
      status: 'active',
    }

    setUser(newCustomerSession)
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newCustomerSession))
    } catch {
      // Storage unavailable
    }

    setIsSigningIn(false)
    return true
  }

  // Secure Logout
  const logout = () => {
    setUser(null)
    setAuthError(null)
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Storage unavailable
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSigningIn,
        authError,
        login,
        registerCustomer,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Role Guard Component
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying session permissions...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white border border-rose-200 rounded-xl shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
          <span className="text-xl font-bold">!</span>
        </div>
        <h3 className="font-bold text-slate-900 text-base">Unauthorized Access</h3>
        <p className="text-xs text-slate-500 mt-1">
          You don&apos;t have permission to access this page. Your role is restricted to your portal.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
