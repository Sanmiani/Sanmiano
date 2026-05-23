import { useQuery } from '@tanstack/react-query'
import * as remindersApi from '../api/reminders'

export function useReminders(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['reminders', page, limit],
    queryFn: () => remindersApi.listRemindersForBranch(page, limit),
  })
}

export function useClientReminders(clientId: string) {
  return useQuery({
    queryKey: ['reminders', 'client', clientId],
    queryFn: () => remindersApi.listRemindersForClient(clientId),
    enabled: !!clientId,
  })
}
