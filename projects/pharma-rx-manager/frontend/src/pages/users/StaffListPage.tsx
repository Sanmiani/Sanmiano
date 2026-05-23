import { useNavigate } from 'react-router-dom'
import { useUsers, useDeactivateUser, useReactivateUser } from '../../hooks/useUsers'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'

export default function StaffListPage() {
  const { data: users, isLoading, error } = useUsers()
  const deactivate = useDeactivateUser()
  const reactivate = useReactivateUser()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>
        <button
          onClick={() => navigate('/staff/new')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          New Staff Member
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading staff...</p>}
      {error && <p className="text-sm text-red-500">Failed to load staff. Please refresh.</p>}

      {users && users.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500 text-sm">No staff members yet.</p>
          <button
            onClick={() => navigate('/staff/new')}
            className="mt-3 text-sm text-indigo-600 hover:underline"
          >
            Add the first staff member
          </button>
        </div>
      )}

      {users && users.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {user.role.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/staff/${user.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Edit
                      </button>
                      {currentUser?.id !== user.id &&
                        (user.isActive ? (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Deactivate ${user.name}? They will not be able to log in.`
                                )
                              ) {
                                deactivate.mutate(user.id)
                              }
                            }}
                            disabled={deactivate.isPending}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivate.mutate(user.id)}
                            disabled={reactivate.isPending}
                            className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        ))}
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
