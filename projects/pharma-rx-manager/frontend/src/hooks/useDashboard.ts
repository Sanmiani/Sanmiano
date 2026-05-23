import { useQuery } from '@tanstack/react-query'
import * as dashboardApi from '../api/dashboard'

export function useBranchDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'branch'],
    queryFn: dashboardApi.getBranchSummary,
  })
}

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'superadmin'],
    queryFn: dashboardApi.getSuperAdminSummary,
  })
}
