import { create } from 'zustand'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'branch_admin' | 'staff'
  branchId: string | null
  organizationId: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const raw = localStorage.getItem('authUser')
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })(),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),

  setTokens: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('authUser', JSON.stringify(user))
    set({ accessToken, refreshToken, user })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authUser')
    set({ accessToken: null, refreshToken: null, user: null })
  },
}))
