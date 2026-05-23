import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as clientsApi from '../api/clients'
import type { ListClientsParams } from '../api/clients'
import type { CreateClientDto, UpdateClientDto } from '../types/client'

export function useClients(params?: ListClientsParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientsApi.listClients(params),
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getClient(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateClientDto) => clientsApi.createClient(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateClientDto) => clientsApi.updateClient(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      qc.invalidateQueries({ queryKey: ['clients', id] })
    },
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}
