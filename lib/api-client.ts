import { API_URL } from "./constants"
import type { ApiError } from "@/types/api"

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>
}

function getTokens() {
  if (typeof window === "undefined") return null
  const tokens = localStorage.getItem("cytyflix_tokens")
  return tokens ? JSON.parse(tokens) : null
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("cytyflix_tokens", JSON.stringify({ accessToken, refreshToken }))
}

function clearTokens() {
  localStorage.removeItem("cytyflix_tokens")
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens()
  if (!tokens?.refreshToken) return null

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })

    if (!res.ok) {
      clearTokens()
      return null
    }

    const data = await res.json()
    setTokens(data.data.accessToken, data.data.refreshToken)
    return data.data.accessToken
  } catch {
    clearTokens()
    return null
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options
  let url = `${API_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.set(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const tokens = getTokens()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) || {}),
  }

  if (tokens?.accessToken) {
    headers["Authorization"] = `Bearer ${tokens.accessToken}`
  }

  let res = await fetch(url, { ...init, headers })

  if (res.status === 401 && tokens?.refreshToken) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`
      res = await fetch(url, { ...init, headers })
    }
  }

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      success: false,
      message: res.statusText || "Something went wrong",
      statusCode: res.status,
    }))
    throw error
  }

  return res.json()
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
}

export { getTokens, setTokens, clearTokens }
