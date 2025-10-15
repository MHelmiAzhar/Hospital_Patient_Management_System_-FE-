import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../shared/hooks/userAuth'
import { useGetProfile } from '../hooks/useGetProfile'
import { updateProfile } from '../api/updateProfile'

export default function ProfileForm() {
  const { user_id } = useAuth()
  const queryClient = useQueryClient()

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  // GET profile data
  const { data: profile, isLoading, isError, error } = useGetProfile(user_id)

  // UPDATE profile
  const mutation = useMutation({
    mutationFn: (data) => updateProfile(user_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', user_id])
      alert('Profile updated successfully!')
    },
    onError: (err) => {
      console.error(err)
      alert('Failed to update profile')
    }
  })

  // Set form value after data loaded
  useEffect(() => {
    const birthDate = profile?.data?.birth_date
      ? profile.data.birth_date.split('T')[0]
      : ''
    if (profile) {
      reset({
        name: profile.data.name,
        email: profile.data.email,
        address: profile.data.address,
        birth_date: birthDate,
        gender: profile.data.gender,
        contact_number: profile.data.contact_number
      })
    }
  }, [profile, reset])

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  if (isLoading) return <p className="text-center mt-5">Loading profile...</p>
  if (isError)
    return (
      <p className="text-center text-red-500 mt-5">
        Failed to load profile: {error.message}
      </p>
    )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto"
    >
      <h2 className="flex text-lg font-semibold mb-4 justify-center">
        My Profile
      </h2>

      <div className="space-y-3">
        <div>
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

        <div>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            {...register('address')}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date
          </label>
          <input
            {...register('birth_date')}
            type="date"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            {...register('gender')}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            {...register('contact_number')}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
      >
        {mutation.isLoading ? 'Saving...' : 'Update Profile'}
      </button>
    </form>
  )
}
