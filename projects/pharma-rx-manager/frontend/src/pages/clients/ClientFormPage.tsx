import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useClient, useCreateClient, useUpdateClient } from '../../hooks/useClients'
import { useBranches } from '../../hooks/useBranches'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'

export default function ClientFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const { data: existing, isLoading: loadingClient } = useClient(id ?? '')
  const { data: branches } = useBranches()

  const createClient = useCreateClient()
  const updateClient = useUpdateClient(id ?? '')

  const [form, setForm] = useState({
    branchId: currentUser?.branchId ?? '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    conditions: '',
    allergies: '',
    insuranceProvider: '',
    insurancePolicyNum: '',
    emailConsent: false,
  })
  const [consentDialogPending, setConsentDialogPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        branchId: existing.branchId,
        name: existing.name,
        email: existing.email,
        phone: existing.phone ?? '',
        dateOfBirth: existing.dateOfBirth
          ? new Date(existing.dateOfBirth).toISOString().slice(0, 10)
          : '',
        conditions: existing.conditions ?? '',
        allergies: existing.allergies ?? '',
        insuranceProvider: existing.insuranceProvider ?? '',
        insurancePolicyNum: existing.insurancePolicyNum ?? '',
        emailConsent: existing.emailConsent,
      })
    }
  }, [existing, isEdit])

  function handleConsentToggle() {
    if (!form.emailConsent) {
      setConsentDialogPending(true)
    } else {
      setForm((f) => ({ ...f, emailConsent: false }))
    }
  }

  function confirmConsent() {
    setForm((f) => ({ ...f, emailConsent: true }))
    setConsentDialogPending(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...(currentUser?.role === 'super_admin' ? { branchId: form.branchId } : {}),
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth,
        conditions: form.conditions || undefined,
        allergies: form.allergies || undefined,
        insuranceProvider: form.insuranceProvider || undefined,
        insurancePolicyNum: form.insurancePolicyNum || undefined,
        emailConsent: form.emailConsent,
      }

      if (isEdit) {
        await updateClient.mutateAsync(payload)
        navigate(`/clients/${id}`)
      } else {
        const client = await createClient.mutateAsync(payload)
        navigate(`/clients/${client.id}`)
      }
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      setError(msg ?? 'Something went wrong. Please try again.')
    }
  }

  if (isEdit && loadingClient) {
    return (
      <PageLayout>
        <p className="text-sm text-gray-500">Loading...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEdit ? 'Edit Client' : 'New Client'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white rounded-lg border border-gray-200 p-6"
        >
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Branch selector — super_admin only, create only */}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions <span className="text-xs text-gray-400">(PHI)</span>
            </label>
            <textarea
              rows={2}
              value={form.conditions}
              onChange={(e) => setForm((f) => ({ ...f, conditions: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies <span className="text-xs text-gray-400">(PHI)</span>
            </label>
            <textarea
              rows={2}
              value={form.allergies}
              onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                value={form.insuranceProvider}
                onChange={(e) => setForm((f) => ({ ...f, insuranceProvider: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Policy #
              </label>
              <input
                type="text"
                value={form.insurancePolicyNum}
                onChange={(e) =>
                  setForm((f) => ({ ...f, insurancePolicyNum: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={handleConsentToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                form.emailConsent ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={form.emailConsent}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.emailConsent ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-gray-700">Email consent for reminders</p>
              {form.emailConsent && (
                <p className="text-xs text-gray-400">
                  Client has consented to receive email reminders.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={createClient.isPending || updateClient.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isEdit ? 'Save Changes' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/clients/${id}` : '/clients')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Consent confirmation dialog */}
      {consentDialogPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Enable email consent?</h2>
            <p className="text-sm text-gray-600 mb-5">
              By enabling this, you confirm the client has consented to receive prescription
              reminder emails from your pharmacy. Today's date will be recorded as the consent
              date.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConsentDialogPending(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmConsent}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Yes, enable consent
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
