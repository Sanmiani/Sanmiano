import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as branchesApi from '../api/branches'

export function useBranches() {
  return useQuery({ queryKey: ['branches'], queryFn: branchesApi.listBranches })
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: () => branchesApi.getBranch(id),
    enabled: !!id,
  })
}

export function useCreateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: branchesApi.createBranch,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}

export function useUpdateBranch(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Parameters<typeof branchesApi.updateBranch>[1]) =>
      branchesApi.updateBranch(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}

export function useDeactivateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => branchesApi.deactivateBranch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}

export function useReactivateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => branchesApi.reactivateBranch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}
