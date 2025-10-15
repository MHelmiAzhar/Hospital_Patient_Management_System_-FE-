import { User, Users, CalendarDays, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ active, onSelect }) {
  const navigate = useNavigate()

  const menus = [
    { name: 'Doctor', icon: <User size={18} /> },
    { name: 'Patient', icon: <Users size={18} /> },
    { name: 'Appointment', icon: <CalendarDays size={18} /> }
  ]

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Delete user data from secure storage
      localStorage.removeItem('User')

      // Redirect to login page
      navigate('/login-admin')
    }
  }

  return (
    <div className="bg-blue-700 text-white w-56 min-h-screen p-4 space-y-2 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-center">🏥 Admin Panel</h1>

      {/* Main Menu */}
      <div className="flex-1 space-y-2">
        {menus.map((m) => (
          <button
            key={m.name}
            onClick={() => onSelect(m.name)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition ${
              active === m.name
                ? 'bg-blue-500'
                : 'hover:bg-blue-600 hover:translate-x-1'
            }`}
          >
            {m.icon}
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition mt-auto"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  )
}
