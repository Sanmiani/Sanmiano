import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as prescriptionsApi from '../api/prescriptions'
import type { CreatePrescriptionDto, UpdatePrescriptionDto } from '../types/prescription'

export function usePrescriptions(clientId: string) {
  return useQuery({
    queryKey: ['prescriptions', 'client', clientId],
    queryFn: () => prescriptionsApi.listPrescriptionsForClient(clientId),
    enabled: !!clientId,
  })
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: ['prescriptions', id],
    queryFn: () => prescriptionsApi.getPrescription(id),
    enabled: !!id,
  })
}

export function useCreatePrescription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreatePrescriptionDto) => prescriptionsApi.createPrescription(dto),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prescriptions', 'client', data.clientId] })
    },
  })
}

export function useUpdatePrescription(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdatePrescriptionDto) => prescriptionsApi.updatePrescription(id, dto),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prescriptions', 'client', data.clientId] })
      qc.invalidateQueries({ queryKey: ['prescriptions', id] })
    },
  })
}

export function useCancelPrescription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => prescriptionsApi.cancelPrescription(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prescriptions', 'client', data.clientId] })
    },
  })
}

export function useCompletePrescription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => prescriptionsApi.completePrescription(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prescriptions', 'client', data.clientId] })
    },
  })
}
