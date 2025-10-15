import { Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = secureLocalStorage.getItem('User')

  if (!user) {
    // jika belum login, arahkan ke halaman login umum
    return <Navigate to="/login-patient" replace />
  }

  if (!allowedRoles.includes(user.user.role)) {
    // jika login tapi bukan role yang diizinkan
    return <Navigate to="/error" replace />
  }

  // jika lolos semua validasi
  return children
}
