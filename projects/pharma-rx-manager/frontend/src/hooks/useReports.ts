import { useQuery } from '@tanstack/react-query'
import { getMonthlySummary } from '../api/reports'

export function useMonthlyReport(year: number, month: number) {
  return useQuery({
    queryKey: ['reports', 'monthly', year, month],
    queryFn: () => getMonthlySummary(year, month),
    enabled: !!year && !!month,
  })
}
