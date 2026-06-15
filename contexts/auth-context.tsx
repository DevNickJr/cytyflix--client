"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import type { User } from "@/types/user"
import type { LoginRequest, RegisterRequest } from "@/types/auth"
import { authService } from "@/services/auth.service"
import { userService } from "@/services/user.service"
import { getTokens, clearTokens } from "@/lib/api-client"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await userService.getMe()
      if (response.success) {
        setUser(response.data)
      }
    } catch {
      setUser(null)
      clearTokens()
    }
  }, [])

  useEffect(() => {
    const tokens = getTokens()
    if (tokens?.accessToken) {
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data)
    if (response.success) {
      await refreshUser()
    }
  }

  const register = async (data: RegisterRequest) => {
    await authService.register(data)
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
