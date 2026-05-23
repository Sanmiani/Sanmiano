import api from './index'
import type { Branch } from '../types/branch'

interface BranchPayload {
  name: string
  address?: string
  city?: string
  province?: string
  phone?: string
  email?: string
}

type Envelope<T> = { success: true; data: T }

export async function listBranches(): Promise<Branch[]> {
  const res = await api.get<Envelope<Branch[]>>('/branches')
  return res.data.data
}

export async function getBranch(id: string): Promise<Branch> {
  const res = await api.get<Envelope<Branch>>(`/branches/${id}`)
  return res.data.data
}

export async function createBranch(dto: BranchPayload): Promise<Branch> {
  const res = await api.post<Envelope<Branch>>('/branches', dto)
  return res.data.data
}

export async function updateBranch(id: string, dto: Partial<BranchPayload>): Promise<Branch> {
  const res = await api.patch<Envelope<Branch>>(`/branches/${id}`, dto)
  return res.data.data
}

export async function deactivateBranch(id: string): Promise<Branch> {
  const res = await api.patch<Envelope<Branch>>(`/branches/${id}/deactivate`)
  return res.data.data
}

export async function reactivateBranch(id: string): Promise<Branch> {
  const res = await api.patch<Envelope<Branch>>(`/branches/${id}/reactivate`)
  return res.data.data
}
