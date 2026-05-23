import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
