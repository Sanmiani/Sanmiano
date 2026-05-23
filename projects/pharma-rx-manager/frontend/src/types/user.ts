export interface StaffUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'branch_admin' | 'staff'
  isActive: boolean
  branchId: string | null
  createdAt: string
}
