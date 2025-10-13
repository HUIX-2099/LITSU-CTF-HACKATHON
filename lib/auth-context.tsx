"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginAction, registerAction, logoutAction, getCurrentUser } from "@/lib/actions/auth"

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
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
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await loginAction(email, password)
    if (result.success && result.user) {
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const register = async (username: string, email: string, password: string) => {
    const result = await registerAction(username, email, password)
    if (result.success && result.user) {
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const logout = async () => {
    await logoutAction()
    setUser(null)
  }

  const refreshUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
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
