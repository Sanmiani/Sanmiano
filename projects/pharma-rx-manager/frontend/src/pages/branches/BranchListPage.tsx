import { useNavigate } from 'react-router-dom'
import { useBranches, useDeactivateBranch, useReactivateBranch } from '../../hooks/useBranches'
import PageLayout from '../../components/layout/PageLayout'

export default function BranchListPage() {
  const { data: branches, isLoading, error } = useBranches()
  const deactivate = useDeactivateBranch()
  const reactivate = useReactivateBranch()
  const navigate = useNavigate()

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Branches</h1>
        <button
          onClick={() => navigate('/branches/new')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          New Branch
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading branches...</p>}
      {error && <p className="text-sm text-red-500">Failed to load branches. Please refresh.</p>}

      {branches && branches.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500 text-sm">No branches yet.</p>
          <button
            onClick={() => navigate('/branches/new')}
            className="mt-3 text-sm text-indigo-600 hover:underline"
          >
            Create the first branch
          </button>
        </div>
      )}

      {branches && branches.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Province</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{branch.name}</td>
                  <td className="px-4 py-3 text-gray-600">{branch.city ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{branch.province}</td>
                  <td className="px-4 py-3 text-gray-600">{branch.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        branch.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/branches/${branch.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Edit
                      </button>
                      {branch.isActive ? (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Deactivate "${branch.name}"? Staff at this branch will not be able to log in.`
                              )
                            ) {
                              deactivate.mutate(branch.id)
                            }
                          }}
                          disabled={deactivate.isPending}
                          className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => reactivate.mutate(branch.id)}
                          disabled={reactivate.isPending}
                          className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  )
}
