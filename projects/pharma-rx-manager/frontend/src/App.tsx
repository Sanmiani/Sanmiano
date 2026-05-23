import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import NotFoundPage from './pages/NotFoundPage'
import { useAuthStore } from './stores/authStore'
import RouteGuard from './components/RouteGuard'
import LoginPage from './pages/auth/LoginPage'
import ResetRequestPage from './pages/auth/ResetRequestPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import BranchListPage from './pages/branches/BranchListPage'
import BranchFormPage from './pages/branches/BranchFormPage'
import StaffListPage from './pages/users/StaffListPage'
import StaffFormPage from './pages/users/StaffFormPage'
import ProfilePage from './pages/profile/ProfilePage'
import ClientListPage from './pages/clients/ClientListPage'
import ClientFormPage from './pages/clients/ClientFormPage'
import ClientProfilePage from './pages/clients/ClientProfilePage'
import PrescriptionFormPage from './pages/prescriptions/PrescriptionFormPage'
import ReminderLogPage from './pages/reminders/ReminderLogPage'
import BranchDashboardPage from './pages/dashboard/BranchDashboardPage'
import SuperAdminDashboardPage from './pages/dashboard/SuperAdminDashboardPage'
import AuditLogPage from './pages/audit/AuditLogPage'
import ReportsPage from './pages/reports/ReportsPage'

function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (user && user.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function StaffManagerGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (user && user.role === 'staff') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function DashboardRouter() {
  const user = useAuthStore((s) => s.user)
  if (user?.role === 'super_admin') return <SuperAdminDashboardPage />
  return <BranchDashboardPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-request" element={<ResetRequestPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RouteGuard>
              <DashboardRouter />
            </RouteGuard>
          }
        />

        {/* Branch management — super_admin only */}
        <Route
          path="/branches"
          element={
            <RouteGuard>
              <SuperAdminGuard>
                <BranchListPage />
              </SuperAdminGuard>
            </RouteGuard>
          }
        />
        <Route
          path="/branches/new"
          element={
            <RouteGuard>
              <SuperAdminGuard>
                <BranchFormPage />
              </SuperAdminGuard>
            </RouteGuard>
          }
        />
        <Route
          path="/branches/:id/edit"
          element={
            <RouteGuard>
              <SuperAdminGuard>
                <BranchFormPage />
              </SuperAdminGuard>
            </RouteGuard>
          }
        />

        {/* Staff management — branch_admin and super_admin */}
        <Route
          path="/staff"
          element={
            <RouteGuard>
              <StaffManagerGuard>
                <StaffListPage />
              </StaffManagerGuard>
            </RouteGuard>
          }
        />
        <Route
          path="/staff/new"
          element={
            <RouteGuard>
              <StaffManagerGuard>
                <StaffFormPage />
              </StaffManagerGuard>
            </RouteGuard>
          }
        />
        <Route
          path="/staff/:id/edit"
          element={
            <RouteGuard>
              <StaffManagerGuard>
                <StaffFormPage />
              </StaffManagerGuard>
            </RouteGuard>
          }
        />

        {/* Client management — all authenticated users */}
        <Route
          path="/clients"
          element={
            <RouteGuard>
              <ClientListPage />
            </RouteGuard>
          }
        />
        <Route
          path="/clients/new"
          element={
            <RouteGuard>
              <ClientFormPage />
            </RouteGuard>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <RouteGuard>
              <ClientProfilePage />
            </RouteGuard>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <RouteGuard>
              <ClientFormPage />
            </RouteGuard>
          }
        />
        <Route
          path="/clients/:clientId/prescriptions/new"
          element={
            <RouteGuard>
              <PrescriptionFormPage />
            </RouteGuard>
          }
        />

        {/* Reminder log — all authenticated users */}
        <Route
          path="/reminders"
          element={
            <RouteGuard>
              <ReminderLogPage />
            </RouteGuard>
          }
        />

        {/* Audit log — super_admin and branch_admin */}
        <Route
          path="/audit"
          element={
            <RouteGuard>
              <StaffManagerGuard>
                <AuditLogPage />
              </StaffManagerGuard>
            </RouteGuard>
          }
        />

        {/* Reports — branch_admin and super_admin */}
        <Route
          path="/reports"
          element={
            <RouteGuard>
              <StaffManagerGuard>
                <ReportsPage />
              </StaffManagerGuard>
            </RouteGuard>
          }
        />

        {/* Profile — all authenticated users */}
        <Route
          path="/profile"
          element={
            <RouteGuard>
              <ProfilePage />
            </RouteGuard>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function AppWithBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}
