export interface Client {
  id: string
  branchId: string
  name: string
  email: string
  phone: string | null
  dateOfBirth: string
  conditions: string | null
  allergies: string | null
  insuranceProvider: string | null
  insurancePolicyNum: string | null
  emailConsent: boolean
  consentDate: string | null
  isDeleted: boolean
  deletedAt: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ClientSummary {
  id: string
  branchId: string
  name: string
  email: string
  phone: string | null
  dateOfBirth: string
  emailConsent: boolean
  consentDate: string | null
  createdAt: string
}

export interface ClientListResult {
  clients: ClientSummary[]
  total: number
  page: number
  limit: number
}

export interface CreateClientDto {
  branchId?: string
  name: string
  email: string
  phone?: string
  dateOfBirth: string
  conditions?: string
  allergies?: string
  insuranceProvider?: string
  insurancePolicyNum?: string
  emailConsent: boolean
}

export interface UpdateClientDto {
  name?: string
  email?: string
  phone?: string | null
  dateOfBirth?: string
  conditions?: string | null
  allergies?: string | null
  insuranceProvider?: string | null
  insurancePolicyNum?: string | null
  emailConsent?: boolean
}
