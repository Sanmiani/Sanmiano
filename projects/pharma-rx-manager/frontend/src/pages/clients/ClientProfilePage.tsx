import { useNavigate, useParams } from 'react-router-dom'
import { useClient, useDeleteClient } from '../../hooks/useClients'
import { usePrescriptions, useCancelPrescription, useCompletePrescription } from '../../hooks/usePrescriptions'
import { useClientReminders } from '../../hooks/useReminders'
import { getClientExportUrl } from '../../api/clients'
import PageLayout from '../../components/layout/PageLayout'
import type { PrescriptionStatus } from '../../types/prescription'
import type { ReminderStatus } from '../../types/reminder'

function RxStatusBadge({ status }: { status: PrescriptionStatus }) {
  const colours: Record<PrescriptionStatus, string> = {
    Active: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colours[status]}`}>
      {status}
    </span>
  )
}

function ReminderStatusBadge({ status }: { status: ReminderStatus }) {
  const colours: Record<ReminderStatus, string> = {
    Sent: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colours[status]}`}>
      {status}
    </span>
  )
}

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: client, isLoading, error } = useClient(id ?? '')
  const deleteClient = useDeleteClient()
  const { data: prescriptions = [] } = usePrescriptions(id ?? '')
  const cancelPrescription = useCancelPrescription()
  const completePrescription = useCompletePrescription()
  const { data: reminderLogs = [] } = useClientReminders(id ?? '')

  function handleDelete() {
    if (!client) return
    if (window.confirm(`Delete ${client.name}? This cannot be undone.`)) {
      deleteClient.mutate(client.id, { onSuccess: () => navigate('/clients') })
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <p className="text-sm text-gray-500">Loading client...</p>
      </PageLayout>
    )
  }

  if (error || !client) {
    return (
      <PageLayout>
        <p className="text-sm text-red-500">Client not found or failed to load.</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-2 block"
          >
            ← Back to clients
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{client.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={getClientExportUrl(client.id)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </a>
          <button
            onClick={() => navigate(`/clients/${client.id}/edit`)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteClient.isPending}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Personal Information
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Full Name</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{client.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Date of Birth</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {new Date(client.dateOfBirth).toLocaleDateString('en-CA')}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{client.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{client.phone ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Insurance Provider</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {client.insuranceProvider ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Policy #</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {client.insurancePolicyNum ?? '—'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Health Information <span className="text-xs font-normal text-red-400">PHI</span>
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Conditions</dt>
                <dd className="font-medium text-gray-900 mt-0.5 whitespace-pre-wrap">
                  {client.conditions || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Allergies</dt>
                <dd className="font-medium text-gray-900 mt-0.5 whitespace-pre-wrap">
                  {client.allergies || '—'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Prescription history */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Prescriptions
              </h2>
              <button
                onClick={() => navigate(`/clients/${id}/prescriptions/new`)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                + New Prescription
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <p className="text-sm text-gray-400">No prescriptions recorded yet.</p>
            ) : (
              <ol className="space-y-4">
                {prescriptions.map((rx) => (
                  <li key={rx.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 text-sm">{rx.medicationName}</span>
                          <span className="text-xs text-gray-400">{rx.medicationForm}</span>
                          <RxStatusBadge status={rx.status} />
                        </div>
                        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
                          {rx.dosage && <div><dt className="inline">Dosage: </dt><dd className="inline font-medium text-gray-700">{rx.dosage}</dd></div>}
                          {rx.frequency && <div><dt className="inline">Frequency: </dt><dd className="inline font-medium text-gray-700">{rx.frequency}</dd></div>}
                          <div><dt className="inline">Qty: </dt><dd className="inline font-medium text-gray-700">{rx.quantityDispensed}</dd></div>
                          <div><dt className="inline">Rate: </dt><dd className="inline font-medium text-gray-700">{rx.dailyUsageRate}/day</dd></div>
                          <div><dt className="inline">Dispensed: </dt><dd className="inline font-medium text-gray-700">{new Date(rx.dispenseDate).toLocaleDateString('en-CA')}</dd></div>
                          {rx.estimatedEndDate && (
                            <div><dt className="inline">Est. end: </dt><dd className="inline font-medium text-gray-700">{new Date(rx.estimatedEndDate).toLocaleDateString('en-CA')}</dd></div>
                          )}
                        </dl>
                        {rx.notes && (
                          <p className="mt-2 text-xs text-gray-500 italic">{rx.notes}</p>
                        )}
                      </div>
                      {rx.status === 'Active' && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (window.confirm('Mark this prescription as completed?')) {
                                completePrescription.mutate(rx.id)
                              }
                            }}
                            disabled={completePrescription.isPending}
                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Cancel this prescription?')) {
                                cancelPrescription.mutate(rx.id)
                              }
                            }}
                            disabled={cancelPrescription.isPending}
                            className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Reminder history */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Reminder History
            </h2>
            {reminderLogs.length === 0 ? (
              <p className="text-sm text-gray-400">No reminders sent yet.</p>
            ) : (
              <ol className="space-y-2">
                {reminderLogs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-4 text-sm py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-800">{log.prescription.medicationName}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {new Date(log.sentAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <ReminderStatusBadge status={log.status} />
                      {log.errorMessage && (
                        <span className="text-xs text-red-400">{log.errorMessage}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Sidebar metadata */}
        <aside className="space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Consent
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Email Reminders</dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      client.emailConsent
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {client.emailConsent ? 'Consented' : 'Not consented'}
                  </span>
                </dd>
              </div>
              {client.consentDate && (
                <div>
                  <dt className="text-gray-500">Consent Date</dt>
                  <dd className="font-medium text-gray-900 mt-0.5">
                    {new Date(client.consentDate).toLocaleDateString('en-CA')}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Record
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {new Date(client.createdAt).toLocaleDateString('en-CA')}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {new Date(client.updatedAt).toLocaleDateString('en-CA')}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </PageLayout>
  )
}
