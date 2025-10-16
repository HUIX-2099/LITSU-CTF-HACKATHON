"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin"
  teamId?: string
  score: number
  solvedChallenges?: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      const data = await res.json()
      setUser(data.user || null)
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success && data.user) {
      setUser(data.user as User)
      return { success: true, user: data.user as User }
    }
    return { success: false, error: data.error || "Login failed" }
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()
    if (data.success && data.user) {
      setUser(data.user as User)
      return { success: true, user: data.user as User }
    }
    return { success: false, error: data.error || "Registration failed" }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    const data = await res.json()
    setUser(data.user || null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
