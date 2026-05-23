import api from './index'
import type { Prescription, CreatePrescriptionDto, UpdatePrescriptionDto } from '../types/prescription'

type Envelope<T> = { success: true; data: T }

export async function listPrescriptionsForClient(clientId: string): Promise<Prescription[]> {
  const res = await api.get<Envelope<Prescription[]>>(`/prescriptions/client/${clientId}`)
  return res.data.data
}

export async function getPrescription(id: string): Promise<Prescription> {
  const res = await api.get<Envelope<Prescription>>(`/prescriptions/${id}`)
  return res.data.data
}

export async function createPrescription(dto: CreatePrescriptionDto): Promise<Prescription> {
  const res = await api.post<Envelope<Prescription>>('/prescriptions', dto)
  return res.data.data
}

export async function updatePrescription(id: string, dto: UpdatePrescriptionDto): Promise<Prescription> {
  const res = await api.patch<Envelope<Prescription>>(`/prescriptions/${id}`, dto)
  return res.data.data
}

export async function cancelPrescription(id: string): Promise<Prescription> {
  const res = await api.post<Envelope<Prescription>>(`/prescriptions/${id}/cancel`)
  return res.data.data
}

export async function completePrescription(id: string): Promise<Prescription> {
  const res = await api.post<Envelope<Prescription>>(`/prescriptions/${id}/complete`)
  return res.data.data
}
