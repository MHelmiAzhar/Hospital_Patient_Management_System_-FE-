import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../utils/schema'
import { Link } from 'react-router'
import { useSignIn } from '../hooks/useSignIn'
import secureLocalStorage from 'react-secure-storage'
import { useState } from 'react'

export default function LoginForm({ role }) {
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const { mutateAsync, isPending } = useSignIn()

  const onSubmit = async (data) => {
    setServerError(null) // Reset server error before new submission
    try {
      const response = await mutateAsync(data)

      secureLocalStorage.setItem('User', response.data)
      window.location.replace(
        role === 'patient'
          ? '/dashboard-patient'
          : role === 'doctor'
          ? '/dashboard-doctor'
          : '/dashboard-admin'
      )
    } catch (error) {
      console.error(error)

      // Capture error from backend
      if (error?.response?.data?.message) {
        setServerError(error.response.data.message)
      } else {
        setServerError('Login failed. Please check your credentials.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          👤{' '}
          {role === 'patient'
            ? 'Patient'
            : role === 'doctor'
            ? 'Doctor'
            : 'Admin'}{' '}
          Login
        </h2>

        {/* Error from server */}
        {serverError && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mb-4 text-center font-medium animate-pulse">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className={`w-full ${
              isPending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 rounded-lg mt-2 transition duration-200 shadow`}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {role === 'patient' && (
          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{' '}
            <Link
              to="/register-patient"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
