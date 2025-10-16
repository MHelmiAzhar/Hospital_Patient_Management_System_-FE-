import { useForm, Controller } from 'react-hook-form'
import { createAppointmentPatientSchema } from '../utils/schema'
import { useAuth } from '../../../shared/hooks/userAuth'
import { useCreateAppointment } from '../../landingAdmin/hooks/useCreateAppointment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAllDoctor } from '../hooks/useGetAllDoctors'
import Select from 'react-select'

export default function AppointmentForm() {
  const { user_id } = useAuth()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createAppointmentPatientSchema)
  })

  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    error: doctorsError,
    isFetching: isFetchingDoctors
  } = useGetAllDoctor()
  const doctors = doctorsData?.data.users ?? []

  const { mutateAsync, isPending, isError, error } = useCreateAppointment()

  const onSubmit = async (data) => {
    try {
      const appointmentDate = `${data.date}T${data.time}:00`

      const appointmentData = {
        patient_user_id: user_id,
        doctor_user_id: parseInt(data.doctor_id.value), // Extract value from object
        date: appointmentDate // format: "YYYY-MM-DD HH:mm"
      }

      console.log('Sending data to backend:', appointmentData)

      const response = await mutateAsync(appointmentData)
      alert('Appointment booked successfully!')
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
    <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
      <h2 className="flex text-lg font-semibold mb-4 justify-center">
        Make Appointment
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
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
        <button
          type="submit"
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
        >
          Book Appointment
        </button>
      </form>
    </div>
  )
}
