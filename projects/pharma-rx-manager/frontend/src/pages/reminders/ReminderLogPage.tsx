import { useState } from 'react'
import { useReminders } from '../../hooks/useReminders'
import PageLayout from '../../components/layout/PageLayout'
import type { ReminderStatus } from '../../types/reminder'

const LIMIT = 50

function StatusBadge({ status }: { status: ReminderStatus }) {
  const colours: Record<ReminderStatus, string> = {
    Sent: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colours[status]}`}>
      {status}
    </span>
  )
}

export default function ReminderLogPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useReminders(page, LIMIT)

  const reminders = data?.logs ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reminder Log</h1>
        <p className="text-sm text-gray-500 mt-1">All reminder emails sent by this branch</p>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

      {error && (
        <p className="text-sm text-red-500">Failed to load reminder log.</p>
      )}

      {!isLoading && !error && reminders.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <p className="text-gray-400 text-sm">No reminders sent yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Reminders are sent automatically each morning for prescriptions nearing their end date.
          </p>
        </div>
      )}

      {!isLoading && !error && reminders.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Medication</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sent To</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Window</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sent At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reminders.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{log.client.name}</td>
                    <td className="px-4 py-3 text-gray-600">{log.prescription.medicationName}</td>
                    <td className="px-4 py-3 text-gray-500">{log.emailAddress}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                        {log.reminderWindow ?? 7}d
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString('en-CA', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={log.status} />
                        {log.errorMessage && (
                          <span className="text-xs text-red-400">{log.errorMessage}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
            <span>
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} reminders
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </PageLayout>
  )
}
