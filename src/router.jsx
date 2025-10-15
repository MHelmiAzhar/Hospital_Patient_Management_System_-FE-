import { createBrowserRouter, Navigate } from 'react-router'
import LandingPagePatient from './features/landingPatient/pages/LandingPagePatient'
import SignUpPatientPage from './features/auth/pages/SignUpPatientPage'
import SignInPagePatient from './features/auth/pages/SignInPagePatient'
import SignInDoctorPage from './features/auth/pages/SignInDoctorPage'
import SignInAdminPage from './features/auth/pages/SignInAdminPage'
import LandingAdminPage from './features/landingAdmin/pages/LandingAdminPage'
import CreateDoctorPage from './features/landingAdmin/pages/createDoctorPage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import UpdateDoctorPage from './features/landingAdmin/pages/UpdateDoctorPage'
import UpdatePatientPage from './features/landingAdmin/pages/UpdatePatientPage'
import CreatePatientPage from './features/landingAdmin/pages/createPatientPage'
import Unauthorized from './shared/pages/UnauthorizedPage'
import AppointmentForm from './features/landingAdmin/pages/AppointmentFormPage'
import EditAppointmentFormPage from './features/landingAdmin/pages/EditAppointmentFormPage'
import EditAppointmentFormPatientPage from './features/landingPatient/pages/EditAppointmentFormPatientPage'
import { useAuth } from './shared/hooks/userAuth'
import LandingDoctorPage from './features/landingDoctor/pages/LandingDoctorPage'

function RootRedirect() {
  const { role } = useAuth()

  if (!role) return <Navigate to="/login-patient" /> // default ke login patient

  // Jika sudah login, arahkan berdasarkan role
  if (role === 'ADMIN') return <Navigate to="/dashboard-admin" />
  if (role === 'DOCTOR') return <Navigate to="/dashboard-doctor" />
  if (role === 'PATIENT') return <Navigate to="/dashboard-patient" />

  return <Navigate to="/login-patient" />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/register-patient',
    element: <SignUpPatientPage />
  },
  {
    path: '/login-patient',
    element: <SignInPagePatient />
  },
  {
    path: '/login-doctor',
    element: <SignInDoctorPage />
  },
  {
    path: '/login-admin',
    element: <SignInAdminPage />
  },
  {
    path: '/dashboard-admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <LandingAdminPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/create/doctor',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <CreateDoctorPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/create/appointment',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppointmentForm />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/create/patient',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <CreatePatientPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/edit/:id/doctor',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UpdateDoctorPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/edit/:id/patient',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <UpdatePatientPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-admin/edit/:id/appointment',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <EditAppointmentFormPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-patient',
    element: (
      <ProtectedRoute allowedRoles={['PATIENT']}>
        <LandingPagePatient />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-patient/edit/:id/appointment',
    element: (
      <ProtectedRoute allowedRoles={['PATIENT']}>
        <EditAppointmentFormPatientPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard-doctor',
    element: (
      <ProtectedRoute allowedRoles={['DOCTOR']}>
        <LandingDoctorPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/error',
    element: <Unauthorized />
  }
])

export default router
