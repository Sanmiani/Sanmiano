export interface Branch {
  id: string
  organizationId: string
  name: string
  address: string | null
  city: string | null
  province: string
  phone: string | null
  email: string | null
  isActive: boolean
  createdAt: string
}
