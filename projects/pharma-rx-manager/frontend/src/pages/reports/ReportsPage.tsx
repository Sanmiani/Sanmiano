import { useState } from 'react'
import { useMonthlyReport } from '../../hooks/useReports'
import { getMonthlyReportCsvUrl } from '../../api/reports'
import PageLayout from '../../components/layout/PageLayout'

const now = new Date()

export default function ReportsPage() {
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const { data, isLoading, error } = useMonthlyReport(year, month)

  const monthOptions = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ]

  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Monthly Report</h1>
        <p className="text-sm text-gray-500 mt-0.5">Prescriptions dispensed, reminders sent, and active client count</p>
      </div>

      {/* Period selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {data && (
            <a
              href={getMonthlyReportCsvUrl(year, month)}
              download
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Download CSV
            </a>
          )}
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading report...</p>}
      {error && <p className="text-sm text-red-500">Failed to load report.</p>}

      {data && (
        <>
          <p className="text-sm font-medium text-gray-500 mb-4">{data.period.label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Prescriptions Dispensed</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{data.prescriptionsDispensed}</p>
              <p className="text-xs text-gray-400 mt-1">New Rx in {data.period.label}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reminders Sent</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{data.remindersSent}</p>
              <p className="text-xs text-gray-400 mt-1">Successful email sends in {data.period.label}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Active Clients</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{data.activeClients}</p>
              <p className="text-xs text-gray-400 mt-1">Clients with at least one active Rx</p>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  )
}
