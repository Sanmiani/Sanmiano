import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreatePrescription } from '../../hooks/usePrescriptions'
import { useClient } from '../../hooks/useClients'
import PageLayout from '../../components/layout/PageLayout'
import type { MedicationForm } from '../../types/prescription'

const MEDICATION_FORMS: MedicationForm[] = ['Tablet', 'Capsule', 'Liquid', 'Cream', 'Inhaler', 'Other']

function computeEstimatedEndDate(dispenseDate: string, qty: number, rate: number): string | null {
  if (!dispenseDate || qty <= 0 || rate <= 0) return null
  const days = Math.round(qty / rate)
  const date = new Date(dispenseDate)
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-CA')
}

export default function PrescriptionFormPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const createPrescription = useCreatePrescription()
  const { data: client } = useClient(clientId ?? '')

  const [form, setForm] = useState({
    medicationName: '',
    medicationForm: 'Tablet' as MedicationForm,
    dosage: '',
    frequency: '',
    quantityDispensed: '',
    dailyUsageRate: '',
    dispenseDate: new Date().toISOString().slice(0, 10),
    expectedEndDate: '',
    reminderDaysThreshold: '7',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)

  const qty = parseFloat(form.quantityDispensed)
  const rate = parseFloat(form.dailyUsageRate)
  const estimatedEndDate = useMemo(
    () => computeEstimatedEndDate(form.dispenseDate, qty, rate),
    [form.dispenseDate, qty, rate]
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!clientId) return

    const qtyNum = parseInt(form.quantityDispensed, 10)
    const rateNum = parseFloat(form.dailyUsageRate)

    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Quantity must be a positive whole number.')
      return
    }
    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Daily usage rate must be a positive number.')
      return
    }

    createPrescription.mutate(
      {
        clientId,
        medicationName: form.medicationName,
        medicationForm: form.medicationForm,
        dosage: form.dosage || undefined,
        frequency: form.frequency || undefined,
        quantityDispensed: qtyNum,
        dailyUsageRate: rateNum,
        dispenseDate: form.dispenseDate,
        expectedEndDate: form.expectedEndDate || undefined,
        reminderDaysThreshold: parseInt(form.reminderDaysThreshold, 10),
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => navigate(`/clients/${clientId}`),
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : 'Failed to create prescription.'
          setError(msg)
        },
      }
    )
  }

  return (
    <PageLayout>
      <div className="max-w-2xl">
        <button
          onClick={() => navigate(`/clients/${clientId}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 block"
        >
          ← Back to client
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">New Prescription</h1>
        {client && (
          <p className="text-sm text-gray-500 mb-6">For {client.name}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Medication */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Medication</h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Medication Name *</label>
              <input
                name="medicationName"
                value={form.medicationName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Metformin"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Form *</label>
                <select
                  name="medicationForm"
                  value={form.medicationForm}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MEDICATION_FORMS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Dosage</label>
                <input
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 500mg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Frequency</label>
              <input
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Twice daily with meals"
              />
            </div>
          </div>

          {/* Supply calculation */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Supply & Dates</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity Dispensed *</label>
                <input
                  name="quantityDispensed"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantityDispensed}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 60"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Daily Usage Rate *</label>
                <input
                  name="dailyUsageRate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.dailyUsageRate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Dispense Date *</label>
                <input
                  name="dispenseDate"
                  type="date"
                  value={form.dispenseDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Expected End Date</label>
                <input
                  name="expectedEndDate"
                  type="date"
                  value={form.expectedEndDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {estimatedEndDate && (
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm">
                <span className="text-indigo-500 font-medium">Estimated end date: </span>
                <span className="text-indigo-900 font-semibold">{estimatedEndDate}</span>
                <span className="text-indigo-400 ml-2">
                  ({Math.round(qty / rate)} day supply)
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1">Reminder Threshold (days before end)</label>
              <input
                name="reminderDaysThreshold"
                type="number"
                min="1"
                step="1"
                value={form.reminderDaysThreshold}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Optional notes for this prescription"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createPrescription.isPending}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {createPrescription.isPending ? 'Saving...' : 'Save Prescription'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/clients/${clientId}`)}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
