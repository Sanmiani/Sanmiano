import { Link } from 'react-router-dom'
import { useBranchDashboard } from '../../hooks/useDashboard'
import PageLayout from '../../components/layout/PageLayout'

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default function BranchDashboardPage() {
  const { data, isLoading, error } = useBranchDashboard()

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Branch overview</p>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">Failed to load dashboard.</p>}

      {data && (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Active Clients" value={data.activeClients} />
            <StatCard label="Active Prescriptions" value={data.activePrescriptions} />
            <StatCard label="Reminders Sent (7 days)" value={data.remindersThisWeek} />
          </div>

          {/* Expiring soon */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Expiring Within 7 Days
              {data.expiringSoon.length > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {data.expiringSoon.length}
                </span>
              )}
            </h2>

            {data.expiringSoon.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No prescriptions expiring in the next 7 days.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Medication
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Est. End Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Days Left
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.expiringSoon.map((rx) => (
                      <tr key={rx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to={`/clients/${rx.clientId}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {rx.clientName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{rx.medicationName}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(rx.estimatedEndDate).toLocaleDateString('en-CA', {
                            dateStyle: 'medium',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              rx.daysLeft <= 2
                                ? 'bg-red-100 text-red-700'
                                : rx.daysLeft <= 4
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {rx.daysLeft}d
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
