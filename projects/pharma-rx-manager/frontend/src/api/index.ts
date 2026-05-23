import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/authStore'

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<void> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (!refreshPromise) {
      refreshPromise = axios
        .post<{ success: true; data: { accessToken: string; refreshToken: string } }>(`${baseURL}/auth/refresh`, { refreshToken })
        .then((res) => {
          const { accessToken, refreshToken: newRefresh } = res.data.data
          const user = useAuthStore.getState().user!
          useAuthStore.getState().setTokens(accessToken, newRefresh, user)
        })
        .catch(() => {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    await refreshPromise
    return api(original)
  }
)

export default api
