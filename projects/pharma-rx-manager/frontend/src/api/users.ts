import api from './index'
import type { StaffUser } from '../types/user'

type Envelope<T> = { success: true; data: T }

interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: 'branch_admin' | 'staff'
  branchId: string
}

interface UpdateUserPayload {
  name?: string
  role?: 'branch_admin' | 'staff'
  isActive?: boolean
}

export async function listUsers(): Promise<StaffUser[]> {
  const res = await api.get<Envelope<StaffUser[]>>('/users')
  return res.data.data
}

export async function getUser(id: string): Promise<StaffUser> {
  const res = await api.get<Envelope<StaffUser>>(`/users/${id}`)
  return res.data.data
}

export async function createUser(dto: CreateUserPayload): Promise<StaffUser> {
  const res = await api.post<Envelope<StaffUser>>('/users', dto)
  return res.data.data
}

export async function updateUser(id: string, dto: UpdateUserPayload): Promise<StaffUser> {
  const res = await api.patch<Envelope<StaffUser>>(`/users/${id}`, dto)
  return res.data.data
}

export async function deactivateUser(id: string): Promise<StaffUser> {
  const res = await api.patch<Envelope<StaffUser>>(`/users/${id}/deactivate`)
  return res.data.data
}

export async function reactivateUser(id: string): Promise<StaffUser> {
  const res = await api.patch<Envelope<StaffUser>>(`/users/${id}/reactivate`)
  return res.data.data
}

export async function changePassword(dto: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  await api.post('/users/me/change-password', dto)
}
