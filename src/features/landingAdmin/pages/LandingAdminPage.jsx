import { useState } from 'react'
import DoctorTable from '../components/DoctorTable'
import PatientTable from '../components/PatientTable'
import AppointmentTable from '../components/AppointmentTable'
import Sidebar from '../components/sidebar'

export default function LandingAdminPage() {
  const [activeMenu, setActiveMenu] = useState('Doctor')

  const renderContent = () => {
    switch (activeMenu) {
      case 'Doctor':
        return <DoctorTable />
      case 'Patient':
        return <PatientTable />
      case 'Appointment':
        return <AppointmentTable />
      default:
        return <div>Select a menu</div>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={activeMenu} onSelect={setActiveMenu} />

      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  )
}
