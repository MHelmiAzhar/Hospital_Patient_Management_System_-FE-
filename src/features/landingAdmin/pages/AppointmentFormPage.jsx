import { useNavigate } from 'react-router-dom'
import { useDoctor } from '../hooks/useDoctor'
import { usePatient } from '../hooks/usePatient'
import { useCreateAppointment } from '../hooks/useCreateAppointment'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAppointmentSchema } from '../utils/schema'
import Select from 'react-select'

export default function AppointmentForm() {
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createAppointmentSchema)
  })

  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctor()
  const { data: patientsData, isLoading: isLoadingPatients } = usePatient()

  const doctors = doctorsData?.data.users ?? []
  const patients = patientsData?.data.users ?? []

  const { mutateAsync, isPending } = useCreateAppointment()

  const onSubmit = async (data) => {
    try {
      const appointmentDate = `${data.date}T${data.time}:00`
      const appointmentData = {
        patient_user_id: parseInt(data.patient_id.value),
        doctor_user_id: parseInt(data.doctor_id.value),
        date: appointmentDate
      }

      console.log('Sending data to backend:', appointmentData)
      await mutateAsync(appointmentData)
      alert('Appointment created successfully!')
      navigate('/dashboard-admin')
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Failed to create appointment')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create Appointment
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Patient Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <Controller
              name="patient_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isLoading={isLoadingPatients}
                  options={patients.map((p) => ({
                    value: p.user_id,
                    label: p.name
                  }))}
                  placeholder="Search and select patient"
                  isSearchable
                />
              )}
            />
            {errors.patient_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.patient_id.message}
              </p>
            )}
          </div>

          {/* Doctor Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <Controller
              name="doctor_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isLoading={isLoadingDoctors}
                  options={doctors.map((d) => ({
                    value: d.user_id,
                    label: `${d.name} — ${d.specialization}`
                  }))}
                  placeholder="Search and select doctor"
                  isSearchable
                />
              )}
            />
            {errors.doctor_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.doctor_id.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Time
            </label>
            <input
              type="time"
              {...register('time')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all"
          >
            {isPending ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
