import api from './index'
import type { ReminderLog } from '../types/reminder'

type Envelope<T> = { success: true; data: T }

export interface ReminderPage {
  logs: ReminderLog[]
  total: number
  page: number
  limit: number
}

export async function listRemindersForBranch(page = 1, limit = 50): Promise<ReminderPage> {
  const res = await api.get<Envelope<ReminderPage>>('/reminders', { params: { page, limit } })
  return res.data.data
}

export async function listRemindersForClient(clientId: string): Promise<ReminderLog[]> {
  const res = await api.get<Envelope<ReminderLog[]>>(`/reminders/client/${clientId}`)
  return res.data.data
}
