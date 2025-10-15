import { useNavigate } from 'react-router-dom'
import { useDoctor } from '../hooks/useDoctor'
import { usePatient } from '../hooks/usePatient'
import { useCreateAppointment } from '../hooks/useCreateAppointment'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAppointmentSchema } from '../utils/schema'

export default function AppointmentForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createAppointmentSchema)
  })

  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    error: doctorsError,
    isFetching: isFetchingDoctors
  } = useDoctor()

  const {
    data: patientsData,
    isLoading: isLoadingPatients,
    isError: isErrorPatients,
    error: patientsError,
    isFetching: isFetchingPatients
  } = usePatient()

  const doctors = doctorsData?.data.users ?? []
  const patients = patientsData?.data.users ?? []

  const { mutateAsync, isPending, isError, error } = useCreateAppointment()

  const onSubmit = async (data) => {
    try {
      const appointmentDate = `${data.date}T${data.time}:00`

      const appointmentData = {
        patient_user_id: parseInt(data.patient_id),
        doctor_user_id: parseInt(data.doctor_id),
        date: appointmentDate
      }

      console.log('Sending data to backend:', appointmentData)

      const response = await mutateAsync(appointmentData)
      alert('Appointment created successfully!')
      navigate('/dashboard-admin')
    } catch (error) {
      console.error('Error creating appointment:', error)

      // Log detailed error information
      if (error.response) {
        // Server responded with error status
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)

        // Display backend error message if available
        const backendMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'Unknown server error'
        alert(`Error: ${backendMessage}`)
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
        alert(
          'Error: No response from server. Please check if the server is running.'
        )
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message)
        alert(`Error: ${error.message}`)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create Appointment
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <select
              {...register('patient_id')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.user_id} value={p.user_id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.patient_id.message}
              </p>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              {...register('doctor_id')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d.user_id} value={d.user_id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
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
