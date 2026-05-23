import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients, useDeleteClient } from '../../hooks/useClients'
import PageLayout from '../../components/layout/PageLayout'

export default function ClientListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = useClients({ search: search || undefined, page, limit })
  const deleteClient = useDeleteClient()

  const totalPages = data ? Math.ceil(data.total / limit) : 1

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
      deleteClient.mutate(id)
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <button
          onClick={() => navigate('/clients/new')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          New Client
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading clients...</p>}
      {error && <p className="text-sm text-red-500">Failed to load clients. Please refresh.</p>}

      {data && data.clients.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500 text-sm">
            {search ? 'No clients match your search.' : 'No clients yet.'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/clients/new')}
              className="mt-3 text-sm text-indigo-600 hover:underline"
            >
              Add the first client
            </button>
          )}
        </div>
      )}

      {data && data.clients.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Date of Birth</th>
                  <th className="px-4 py-3 text-left">Consent</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="text-indigo-600 hover:underline text-left"
                      >
                        {client.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{client.email}</td>
                    <td className="px-4 py-3 text-gray-600">{client.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(client.dateOfBirth).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          client.emailConsent
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {client.emailConsent ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/clients/${client.id}/edit`)}
                          className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          disabled={deleteClient.isPending}
                          className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of{' '}
                {data.total} clients
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-40"
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
