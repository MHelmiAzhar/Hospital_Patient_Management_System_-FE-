import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAppointmentPatientSchema } from '../utils/schema'
import { useGetAllAppointments } from '../../landingAdmin/hooks/useGetAllAppointment'
import { useUpdateAppointmentPatient } from '../hooks/useUpdateAppointment'
import { useGetAllDoctor } from '../hooks/useGetAllDoctors'

export default function EditAppointmentFormPatientPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Fetch existing appointment data
  const {
    data: appointmentData,
    isLoading: isLoadingAppointment,
    isError: isErrorAppointment
  } = useGetAllAppointments({ appointment_id: id })

  // Get doctors
  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    error: doctorsError,
    isFetching: isFetchingDoctors
  } = useGetAllDoctor()
  const doctors = doctorsData?.data.users ?? []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createAppointmentPatientSchema)
  })

  const appointmentExists = appointmentData?.data?.appointments ?? []

  const { mutateAsync, isPending, isError, error } =
    useUpdateAppointmentPatient()

  // Prefill form after appointment data is successfully loaded
  useEffect(() => {
    if (appointmentExists.length > 0) {
      const { date, status } = appointmentExists[0]
      const doctor_user_id = appointmentExists[0].doctor.user_id

      const [appointmentDate, appointmentTimeFull] = date.split('T')
      const appointmentTime = appointmentTimeFull.slice(0, 5) // Get HH:mm format

      reset({
        doctor_id: String(doctor_user_id),
        date: appointmentDate,
        time: appointmentTime,
        status
      })
    }
  }, [appointmentExists, reset])

  const onSubmit = async (formData) => {
    try {
      const appointmentDate = `${formData.date}T${formData.time}:00`

      const payload = {
        doctor_user_id: Number(formData.doctor_id),
        date: appointmentDate,
        status: formData.status
      }

      console.log('Updating appointment:', payload)

      await mutateAsync({ id, data: payload })
      alert('Appointment updated successfully!')
      navigate('/dashboard-patient')
    } catch (err) {
      console.error('Error updating appointment:', err)
      alert(
        err.response?.data?.message ||
          'Failed to update appointment. Please try again.'
      )
    }
  }

  if (isLoadingAppointment) {
    return <div className="text-center mt-10">Loading appointment data...</div>
  }

  if (isErrorAppointment) {
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load appointment data.
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Edit Appointment
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                Dr. {d.name} — {d.specialization}
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
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
        >
          {isPending ? 'Updating...' : 'Update Appointment'}
        </button>
      </form>
    </div>
  )
}
