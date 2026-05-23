import { useSuperAdminDashboard } from '../../hooks/useDashboard'
import PageLayout from '../../components/layout/PageLayout'

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default function SuperAdminDashboardPage() {
  const { data, isLoading, error } = useSuperAdminDashboard()

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Organisation-wide overview</p>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">Failed to load dashboard.</p>}

      {data && (
        <div className="space-y-8">
          {/* Org-wide stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Active Clients" value={data.totalClients} />
            <StatCard label="Total Active Prescriptions" value={data.totalActivePrescriptions} />
            <StatCard label="Reminders Sent (7 days)" value={data.totalRemindersThisWeek} />
          </div>

          {/* Per-branch table */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Branch Summary</h2>

            {data.branches.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No active branches found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Branch
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Active Clients
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Active Rx
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Reminders (7d)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.branches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{branch.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{branch.activeClients}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{branch.activePrescriptions}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{branch.remindersThisWeek}</td>
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
