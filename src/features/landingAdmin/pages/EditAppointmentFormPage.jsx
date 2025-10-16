import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateAppointmentSchema } from '../utils/schema'
import { useDoctor } from '../hooks/useDoctor'
import { useGetAllAppointments } from '../hooks/useGetAllAppointment'
import { useUpdateAppointment } from '../hooks/useUpdateAppointment'
import Select from 'react-select'

export default function EditAppointmentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Fetch existing appointment data
  const {
    data: appointmentData,
    isLoading: isLoadingAppointment,
    isError: isErrorAppointment
  } = useGetAllAppointments({ appointment_id: id })

  // Get doctors & patients for select options
  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors
  } = useDoctor()

  const doctors = doctorsData?.data?.users ?? []

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateAppointmentSchema)
  })

  const appointmentExists = appointmentData?.data?.appointments ?? []

  const { mutateAsync, isPending, isError, error } = useUpdateAppointment()

  // Prefill form after appointment data is successfully loaded
  useEffect(() => {
    if (appointmentExists.length > 0 && doctors.length > 0) {
      const { date, status } = appointmentExists[0]
      const doctor_user_id = appointmentExists[0].doctor.user_id
      const doctor_name = appointmentExists[0].doctor.name
      const doctor_specialization =
        appointmentExists[0].doctor?.doctor?.specialization || 'Specialist'

      const [appointmentDate, appointmentTimeFull] = date.split('T')
      const appointmentTime = appointmentTimeFull.slice(0, 5) // Get HH:mm format

      reset({
        doctor_id: {
          value: doctor_user_id,
          label: `${doctor_name} — ${doctor_specialization}`
        },
        date: appointmentDate,
        time: appointmentTime,
        status
      })
    }
  }, [appointmentExists, doctors, reset])

  const onSubmit = async (formData) => {
    try {
      const appointmentDate = `${formData.date}T${formData.time}:00`

      const payload = {
        doctor_user_id: parseInt(formData.doctor_id.value), // Extract value from object
        date: appointmentDate,
        status: formData.status
      }

      console.log('Updating appointment:', payload)

      await mutateAsync({ id, data: payload })
      alert('Appointment updated successfully!')
      navigate('/dashboard-admin')
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Edit Appointment
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Doctor */}
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full ${
              isPending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 rounded-lg mt-2 transition duration-200 shadow`}
          >
            {isPending ? 'Updating...' : 'Update Appointment'}
          </button>
        </form>
        <p className=" text-sm text-gray-500 text-center mt-6">
          <Link
            to="/dashboard-admin"
            className="text-blue-600 hover:underline font-medium"
          >
            Back
          </Link>
        </p>
      </div>
    </div>
  )
}
