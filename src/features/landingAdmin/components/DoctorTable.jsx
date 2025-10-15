import { useState } from 'react'
import { useDoctor } from '../hooks/useDoctor'
import useDebounce from '../hooks/useDebounce'
import { Link, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDoctor } from '../api/deleteDoctor'

export default function DoctorTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const size = 10
  const debouncedSearch = useDebounce(search, 350)
  const role = 'DOCTOR'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Call hook with pagination and debounced search
  const { data, isLoading, isError, error, isFetching } = useDoctor({
    search: debouncedSearch,
    role,
    page,
    size
  })

  const doctors = data?.data?.users ?? []
  const pagination = data?.data?.pagination ?? {}

  // Mutation delete
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDoctor(id),
    onSuccess: () => {
      alert('Doctor deleted successfully!')
      queryClient.invalidateQueries(['doctors'])
    },
    onError: (error) => {
      alert(
        'Failed to delete doctor: ' +
          (error.response?.data?.message || error.message)
      )
    }
  })

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      deleteMutation.mutate(id)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-5">Manage Doctors</h2>

      {/* Search bar + add button */}
      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="border px-3 py-1 rounded w-60"
        />

        <div className="flex items-center gap-3">
          {isFetching && (
            <span className="text-sm text-gray-500">Refreshing...</span>
          )}
          <Link
            to="./create/doctor"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Doctor
          </Link>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-600">
          Error: {error?.message || 'Something went wrong'}
        </div>
      ) : (
        <>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">No</th>
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Specialization</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <tr
                    key={doctor.user_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      {(page - 1) * size + (index + 1)}
                    </td>
                    <td className="py-2 px-3">{doctor.name}</td>
                    <td className="py-2 px-3">{doctor.specialization}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        className="text-blue-600 hover:underline mr-3"
                        onClick={() =>
                          navigate(
                            `/dashboard-admin/edit/${doctor.user_id}/doctor`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.user_id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-5">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`px-3 py-1 border rounded ${
                  page === 1
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
              >
                Previous
              </button>

              <span className="text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 border rounded ${
                  page === pagination.totalPages
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
