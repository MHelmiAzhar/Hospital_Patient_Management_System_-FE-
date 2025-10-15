import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePatient } from '../api/updatePatient'
import { getUserById } from '../api/updateDoctor'

export default function UpdatePatientPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getUserById(id)
  })

  const mutation = useMutation({
    mutationFn: (data) => updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      alert('Patient updated successfully!')
      navigate('/dashboard-admin')
    },
    onError: (err) => {
      alert('Failed to update patient: ' + err)
    }
  })

  // Set form value after data loaded
  useEffect(() => {
    const birthDate = patient?.data?.birth_date
      ? patient.data.birth_date.split('T')[0]
      : ''
    if (patient && patient.data) {
      reset({
        name: patient.data.name,
        email: patient.data.email,
        address: patient.data.address,
        birth_date: birthDate,
        gender: patient.data.gender,
        contact_number: patient.data.contact_number
      })
    }
  }, [patient, reset])

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  if (isLoading) return <p>Loading patient data...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Update Patient
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              {...register('address', { required: 'Address is required' })}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              {...register('birth_date', {
                required: 'Birth Date is required'
              })}
              type="date"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.birth_date && (
              <p className="text-red-500 text-sm">
                {errors.birth_date.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              {...register('contact_number', {
                required: 'Contact number is required'
              })}
              type="text"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm">
                {errors.contact_number.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`w-full ${
              mutation.isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 rounded-lg mt-2 transition duration-200 shadow`}
          >
            {mutation.isLoading ? 'Updating...' : 'Update Patient'}
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
