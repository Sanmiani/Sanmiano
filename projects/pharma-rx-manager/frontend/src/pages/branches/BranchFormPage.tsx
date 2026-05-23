import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBranch, useCreateBranch, useUpdateBranch } from '../../hooks/useBranches'
import PageLayout from '../../components/layout/PageLayout'

interface FormState {
  name: string
  address: string
  city: string
  province: string
  phone: string
  email: string
}

const empty: FormState = {
  name: '',
  address: '',
  city: '',
  province: 'ON',
  phone: '',
  email: '',
}

export default function BranchFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: branch, isLoading: branchLoading } = useBranch(id ?? '')
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch(id ?? '')

  const [form, setForm] = useState<FormState>(empty)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        address: branch.address ?? '',
        city: branch.city ?? '',
        province: branch.province,
        phone: branch.phone ?? '',
        email: branch.email ?? '',
      })
    }
  }, [branch])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Branch name is required')
      return
    }
    setError('')
    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      province: form.province.trim() || 'ON',
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
    }

    try {
      if (isEdit) {
        await updateBranch.mutateAsync(payload)
      } else {
        await createBranch.mutateAsync(payload)
      }
      navigate('/branches')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: { message?: string } } } }
        setError(axiosErr.response?.data?.error?.message ?? 'Save failed')
      } else {
        setError('Save failed')
      }
      setSubmitting(false)
    }
  }

  if (isEdit && branchLoading) {
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
          {isEdit ? 'Edit Branch' : 'New Branch'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={set('name')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={set('address')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={set('city')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="province">
                Province
              </label>
              <input
                id="province"
                type="text"
                value={form.province}
                onChange={set('province')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Branch'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/branches')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
