import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listAuditLogs, type AuditAction, type AuditFilters } from '../../api/audit'
import PageLayout from '../../components/layout/PageLayout'

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  VIEW_SENSITIVE: 'View PHI',
}

const ACTION_COLOURS: Record<AuditAction, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-600',
  VIEW_SENSITIVE: 'bg-yellow-100 text-yellow-700',
}

export default function AuditLogPage() {
  const [filters, setFilters] = useState<AuditFilters>({ page: 1, limit: 50 })
  const [draft, setDraft] = useState({ action: '', resourceType: '', from: '', to: '' })

  const { data, isLoading, error } = useQuery({
    queryKey: ['audit', filters],
    queryFn: () => listAuditLogs(filters),
  })

  function applyFilters() {
    setFilters({
      page: 1,
      limit: 50,
      action: draft.action ? (draft.action as AuditAction) : undefined,
      resourceType: draft.resourceType || undefined,
      from: draft.from || undefined,
      to: draft.to || undefined,
    })
  }

  function clearFilters() {
    setDraft({ action: '', resourceType: '', from: '', to: '' })
    setFilters({ page: 1, limit: 50 })
  }

  const logs = data?.logs ?? []
  const total = data?.total ?? 0
  const page = data?.page ?? 1
  const limit = data?.limit ?? 50
  const totalPages = Math.ceil(total / limit)

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-0.5">All system actions across your organisation</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Action</label>
            <select
              value={draft.action}
              onChange={(e) => setDraft((d) => ({ ...d, action: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All actions</option>
              {(Object.keys(ACTION_LABELS) as AuditAction[]).map((a) => (
                <option key={a} value={a}>{ACTION_LABELS[a]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Resource type</label>
            <select
              value={draft.resourceType}
              onChange={(e) => setDraft((d) => ({ ...d, resourceType: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All resources</option>
              <option value="Client">Client</option>
              <option value="Prescription">Prescription</option>
              <option value="User">User</option>
              <option value="Branch">Branch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={draft.from}
              onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={draft.to}
              onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load audit log.</p>
      ) : (
        <>
          <div className="text-xs text-gray-400 mb-3">{total.toLocaleString()} total entries</div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400 p-6">No entries match the current filters.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Resource</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Branch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleString('en-CA', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLOURS[entry.action]}`}>
                          {ACTION_LABELS[entry.action]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="font-medium">{entry.resourceType}</span>
                        <span className="text-gray-400 text-xs ml-1.5 font-mono">{entry.resourceId.slice(0, 8)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{entry.user.name}</span>
                        <span className="text-gray-400 text-xs ml-1.5">({entry.user.role})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{entry.branch?.name ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}
