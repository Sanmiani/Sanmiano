import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface Props {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: Props) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-14 flex items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name}
          <span className="ml-1 text-xs text-gray-400">
            ({user?.role.replace(/_/g, ' ')})
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
