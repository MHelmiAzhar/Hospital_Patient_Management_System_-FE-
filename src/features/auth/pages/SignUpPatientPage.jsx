import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpSchema } from '../utils/schema'
import { useSignUp } from '../hooks/useSignUp'
import secureLocalStorage from 'react-secure-storage'
import { AxiosError } from 'axios'
import { Link } from 'react-router'

export default function SignUpPatientPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const { mutateAsync, isPending } = useSignUp()
  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync(data)

      secureLocalStorage.setItem('User', response.data)

      window.location.replace('/dashboard-patient')
    } catch (error) {
      if (error instanceof AxiosError) {
        return alert(error.response?.data.message ?? 'Something went wrong')
      }
      const err = error
      alert(err.message ?? 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          👤 Register Patient
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              name="name"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Enter your full name"
            />
            {errors?.name && (
              <p className="text-red-600 text-sm mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              name="email"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email?.message}
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
              name="password"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password?.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('contact_number')}
              name="contact_number"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="08123456789"
            />
            {errors.contact_number && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contact_number?.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('address')}
              name="address"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
              placeholder="Your address"
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">
                {errors.address?.message}
              </p>
            )}
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              {...register('birth_date')}
              type="date"
              name="birth_date"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
            />
            {errors.birth_date && (
              <p className="text-red-600 text-sm mt-1">
                {errors.birth_date?.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender')}
              name="gender"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition bg-white"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">
                {errors.gender?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4 transition duration-200 shadow cursor-pointer"
          >
            {isPending ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link
            to="/login-patient"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
