import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as usersApi from '../api/users'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: usersApi.listUsers })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Parameters<typeof usersApi.updateUser>[1]) => usersApi.updateUser(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.deactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useReactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.reactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: usersApi.changePassword })
}
