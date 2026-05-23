import api from './index'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW_SENSITIVE'

export interface AuditLogEntry {
  id: string
  action: AuditAction
  resourceType: string
  resourceId: string
  metadata: Record<string, unknown> | null
  createdAt: string
  user: { id: string; name: string; email: string; role: string }
  branch: { id: string; name: string } | null
}

export interface AuditListResult {
  logs: AuditLogEntry[]
  total: number
  page: number
  limit: number
}

export interface AuditFilters {
  userId?: string
  action?: AuditAction
  resourceType?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

type Envelope<T> = { success: true; data: T }

export async function listAuditLogs(filters: AuditFilters = {}): Promise<AuditListResult> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  )
  const res = await api.get<Envelope<AuditListResult>>('/audit', { params })
  return res.data.data
}
