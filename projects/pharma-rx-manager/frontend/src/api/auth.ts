import { api } from './index'
import type { AuthUser } from '../stores/authStore'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<{ success: true; data: AuthResponse }>('/auth/login', { email, password })
  return res.data.data
}

export async function refreshApi(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await api.post<{ success: true; data: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken })
  return res.data.data
}

export async function resetRequestApi(email: string): Promise<void> {
  await api.post('/auth/reset-request', { email })
}

export async function resetPasswordApi(token: string, newPassword: string): Promise<void> {
  await api.post('/auth/reset', { token, newPassword })
}
