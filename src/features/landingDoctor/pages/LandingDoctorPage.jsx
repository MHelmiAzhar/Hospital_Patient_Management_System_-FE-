import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import ProfileFormDoctor from '../components/ProfileFormDoctor'
import AppointmentDoctor from '../components/AppointmentDoctor'

export default function LandingDoctorPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'appointment', label: 'Appointment' }
  ]
  const navigate = useNavigate()
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Delete user data from secure storage
      localStorage.removeItem('User')

      // Redirect to login page
      navigate('/login-patient')
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-end gap-2 w-fit px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition mt-auto"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      {/* Tabs Navigation */}
      <div className="flex justify-center bg-white border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium ${
              activeTab === tab.id
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 ">
        {activeTab === 'profile' && <ProfileFormDoctor />}
        {activeTab === 'appointment' && <AppointmentDoctor />}
      </div>
    </div>
  )
}
