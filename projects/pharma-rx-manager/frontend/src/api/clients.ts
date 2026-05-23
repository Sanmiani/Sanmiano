import api from './index'
import type { Client, ClientListResult, CreateClientDto, UpdateClientDto } from '../types/client'

type Envelope<T> = { success: true; data: T }

export interface ListClientsParams {
  search?: string
  page?: number
  limit?: number
}

export async function listClients(params?: ListClientsParams): Promise<ClientListResult> {
  const res = await api.get<Envelope<ClientListResult>>('/clients', { params })
  return res.data.data
}

export async function getClient(id: string): Promise<Client> {
  const res = await api.get<Envelope<Client>>(`/clients/${id}`)
  return res.data.data
}

export async function createClient(dto: CreateClientDto): Promise<Client> {
  const res = await api.post<Envelope<Client>>('/clients', dto)
  return res.data.data
}

export async function updateClient(id: string, dto: UpdateClientDto): Promise<Client> {
  const res = await api.patch<Envelope<Client>>(`/clients/${id}`, dto)
  return res.data.data
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`)
}

export function getClientExportUrl(id: string): string {
  return `/api/clients/${id}/export`
}
