import { useState } from 'react'
import { useChangePassword } from '../../hooks/useUsers'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const changePassword = useChangePassword()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setSuccess(true)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      setError(msg ?? 'Failed to change password. Please try again.')
    }
  }

  return (
    <PageLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          {user?.name} · {user?.role.replace(/_/g, ' ')}
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                Password updated successfully.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={form.currentPassword}
                onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
