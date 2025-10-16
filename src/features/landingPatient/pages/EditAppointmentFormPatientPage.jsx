import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAppointmentPatientSchema } from '../utils/schema'
import { useGetAllAppointments } from '../../landingAdmin/hooks/useGetAllAppointment'
import { useUpdateAppointmentPatient } from '../hooks/useUpdateAppointment'
import { useGetAllDoctor } from '../hooks/useGetAllDoctors'
import Select from 'react-select'

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
    control,
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
    if (appointmentExists.length > 0 && doctors.length > 0) {
      const { date, status } = appointmentExists[0]
      const doctor_user_id = appointmentExists[0].doctor.user_id
      const doctor_name = appointmentExists[0].doctor.name
      const doctor_specialization =
        appointmentExists[0].doctor?.doctor?.specialization || 'null'

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
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
        >
          {isPending ? 'Updating...' : 'Update Appointment'}
        </button>
      </form>
    </div>
  )
}
