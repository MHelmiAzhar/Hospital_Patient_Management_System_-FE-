import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserById, updateDoctor } from '../api/updateDoctor'

export default function UpdateDoctorFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getUserById(id)
  })

  const mutation = useMutation({
    mutationFn: (data) => updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors'])
      navigate('/dashboard-admin')
      alert('Doctor updated successfully!')
    },
    onError: (err) => {
      alert('Failed to update doctor: ' + err)
    }
  })

  useEffect(() => {
    if (doctor && doctor.data) {
      reset({
        name: doctor.data.name,
        email: doctor.data.email,
        specialization: doctor.data.specialization
      })
    }
  }, [doctor, reset])

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  if (isLoading) return <p>Loading doctor data...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Update Doctor
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
              Specialization
            </label>
            <input
              {...register('specialization', {
                required: 'Specialization is required'
              })}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">
                {errors.specialization.message}
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
            {mutation.isLoading ? 'Updating...' : 'Update Doctor'}
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
