import api from './index'

type Envelope<T> = { success: true; data: T }

export type ExpiringRx = {
  id: string
  clientId: string
  clientName: string
  medicationName: string
  estimatedEndDate: string
  daysLeft: number
}

export type BranchSummary = {
  activeClients: number
  activePrescriptions: number
  remindersThisWeek: number
  expiringSoon: ExpiringRx[]
}

export type BranchRow = {
  id: string
  name: string
  activeClients: number
  activePrescriptions: number
  remindersThisWeek: number
}

export type SuperAdminSummary = {
  totalClients: number
  totalActivePrescriptions: number
  totalRemindersThisWeek: number
  branches: BranchRow[]
}

export async function getBranchSummary(): Promise<BranchSummary> {
  const res = await api.get<Envelope<BranchSummary>>('/dashboard')
  return res.data.data
}

export async function getSuperAdminSummary(): Promise<SuperAdminSummary> {
  const res = await api.get<Envelope<SuperAdminSummary>>('/dashboard')
  return res.data.data
}
