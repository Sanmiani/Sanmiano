import api from './index'

type Envelope<T> = { success: true; data: T }

export interface MonthlyReport {
  period: { year: number; month: number; label: string }
  prescriptionsDispensed: number
  remindersSent: number
  activeClients: number
}

export async function getMonthlySummary(year: number, month: number): Promise<MonthlyReport> {
  const res = await api.get<Envelope<MonthlyReport>>('/reports/monthly', { params: { year, month } })
  return res.data.data
}

export function getMonthlyReportCsvUrl(year: number, month: number): string {
  return `${api.defaults.baseURL}/reports/monthly/csv?year=${year}&month=${month}`
}
