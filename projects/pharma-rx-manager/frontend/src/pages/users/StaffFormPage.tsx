import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateUser, useUpdateUser, useUser } from '../../hooks/useUsers'
import { useBranches } from '../../hooks/useBranches'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'

export default function StaffFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const { data: existing, isLoading: loadingUser } = useUser(id ?? '')
  const { data: branches } = useBranches()

  const createUser = useCreateUser()
  const updateUser = useUpdateUser(id ?? '')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as 'branch_admin' | 'staff',
    branchId: currentUser?.branchId ?? '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing && isEdit) {
      setForm((f) => ({
        ...f,
        name: existing.name,
        email: existing.email,
        role: existing.role as 'branch_admin' | 'staff',
        branchId: existing.branchId ?? '',
      }))
    }
  }, [existing, isEdit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) {
        await updateUser.mutateAsync({ name: form.name, role: form.role })
      } else {
        await createUser.mutateAsync(form)
      }
      navigate('/staff')
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      setError(msg ?? 'Something went wrong. Please try again.')
    }
  }

  if (isEdit && loadingUser) {
    return (
      <PageLayout>
        <p className="text-sm text-gray-500">Loading...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEdit ? 'Edit Staff Member' : 'New Staff Member'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-lg border border-gray-200 p-6"
        >
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value as 'branch_admin' | 'staff' }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="staff">Staff</option>
              <option value="branch_admin">Branch Admin</option>
            </select>
          </div>

          {!isEdit && currentUser?.role === 'super_admin' && branches && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                required
                value={form.branchId}
                onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={createUser.isPending || updateUser.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isEdit ? 'Save Changes' : 'Create Staff Member'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/staff')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
