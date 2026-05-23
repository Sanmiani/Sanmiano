export type MedicationForm = 'Tablet' | 'Capsule' | 'Liquid' | 'Cream' | 'Inhaler' | 'Other'
export type PrescriptionStatus = 'Active' | 'Completed' | 'Cancelled'

export interface Prescription {
  id: string
  clientId: string
  branchId: string
  medicationName: string
  medicationForm: MedicationForm
  dosage: string | null
  frequency: string | null
  quantityDispensed: number
  dailyUsageRate: number
  dispenseDate: string
  expectedEndDate: string | null
  estimatedEndDate: string | null
  reminderDaysThreshold: number
  status: PrescriptionStatus
  notes: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreatePrescriptionDto {
  clientId: string
  medicationName: string
  medicationForm: MedicationForm
  dosage?: string
  frequency?: string
  quantityDispensed: number
  dailyUsageRate: number
  dispenseDate: string
  expectedEndDate?: string
  reminderDaysThreshold?: number
  notes?: string
}

export interface UpdatePrescriptionDto {
  status?: PrescriptionStatus
  notes?: string | null
  reminderDaysThreshold?: number
}
