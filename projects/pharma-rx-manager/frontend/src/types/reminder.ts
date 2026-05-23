export type ReminderStatus = 'Sent' | 'Failed'

export interface ReminderLog {
  id: string
  prescriptionId: string
  clientId: string
  branchId: string
  sentAt: string
  emailAddress: string
  status: ReminderStatus
  reminderWindow: number
  errorMessage: string | null
  prescription: {
    medicationName: string
  }
  client: {
    name: string
  }
}
