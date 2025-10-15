import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useCreateDoctor } from '../hooks/useCreateDoctor'
import { createDoctorSchema } from '../utils/schema'
import { zodResolver } from '@hookform/resolvers/zod'

export default function CreateDoctorPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createDoctorSchema)
  })
  const { mutateAsync, isPending, isSuccess, isError, error } =
    useCreateDoctor()

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync(data)
      alert('Doctor created successfully')
      navigate('/dashboard-admin')
    } catch (error) {
      console.log(error)
      alert('Failed to create doctor: ' + error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create New Doctor
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Dr. John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="doctor@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('specialization')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Cardiologist"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full ${
              isPending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 rounded-lg mt-2 transition duration-200 shadow`}
          >
            {isPending ? 'Creating...' : 'Create Doctor'}
          </button>

          {/* Feedback */}
          {isSuccess && (
            <p className="text-green-600 text-center mt-3">
              Doctor created successfully!
            </p>
          )}
          {isError && (
            <p className="bg-red-600 text-white text-center mt-3 p-1 rounded-2xl">
              {error?.response?.data?.message || 'Failed to create doctor'}
            </p>
          )}
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
