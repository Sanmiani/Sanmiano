import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

type Role = 'super_admin' | 'branch_admin' | 'staff'

const navItems: { to: string; label: string; roles: Role[] }[] = [
  { to: '/', label: 'Dashboard', roles: ['super_admin', 'branch_admin', 'staff'] },
  { to: '/branches', label: 'Branches', roles: ['super_admin'] },
  { to: '/staff', label: 'Staff', roles: ['super_admin', 'branch_admin'] },
  { to: '/clients', label: 'Clients', roles: ['super_admin', 'branch_admin', 'staff'] },
  { to: '/reminders', label: 'Reminders', roles: ['super_admin', 'branch_admin', 'staff'] },
  { to: '/audit', label: 'Audit Log', roles: ['super_admin', 'branch_admin'] },
  { to: '/reports', label: 'Reports', roles: ['super_admin', 'branch_admin'] },
  { to: '/profile', label: 'Profile', roles: ['super_admin', 'branch_admin', 'staff'] },
]

interface Props {
  onClose?: () => void
}

export default function Sidebar({ onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  if (!user) return null

  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-gray-100 flex flex-col min-h-screen">
      <div className="px-6 py-5 text-lg font-bold tracking-tight border-b border-gray-700">
        Pharma RX
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(user.role as Role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}
