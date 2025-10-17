import { useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import { Link, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePatient } from '../hooks/usePatient'
import { deletePatient } from '../api/deletePatient'

export default function PatientTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const debouncedSearch = useDebounce(search, 350)
  const role = 'PATIENT'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, isFetching } = usePatient({
    search: debouncedSearch,
    role,
    page,
    size
  })

  const patients = data?.data?.users ?? []
  const pagination = data?.data?.pagination ?? {}

  // Mutation for deleting patient
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePatient(id),
    onSuccess: () => {
      alert('Patient deleted successfully!')
      queryClient.invalidateQueries(['patients'])
    },
    onError: (error) => {
      alert(
        'Failed to delete patient: ' +
          (error.response?.data?.message || error.message)
      )
    }
  })

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this patient?')) {
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
      <h2 className="text-2xl font-semibold mb-5">Manage Patients</h2>

      {/* Search & Add */}
      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="border px-3 py-1 rounded w-60"
        />

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            {isFetching ? 'Loading...' : ''}
          </div>
          <Link
            to="./create/patient"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Patient
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
                <th className="py-2 px-3 text-left">Address</th>
                <th className="py-2 px-3 text-center">Birth Date</th>
                <th className="py-2 px-3 text-center">Gender</th>
                <th className="py-2 px-3 text-center">Contact Number</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => {
                  const dateObj = new Date(patient.birth_date)
                  const formattedDate = patient.birth_date
                    ? `${String(dateObj.getDate()).padStart(2, '0')}/${String(
                        dateObj.getMonth() + 1
                      ).padStart(2, '0')}/${dateObj.getFullYear()}`
                    : '-'

                  return (
                    <tr
                      key={patient.user_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-2 px-3">
                        {(page - 1) * size + index + 1}
                      </td>
                      <td className="py-2 px-3">{patient.name}</td>
                      <td className="py-2 px-3">{patient.address}</td>
                      <td className="py-2 px-3 text-center">{formattedDate}</td>
                      <td className="py-2 px-3 text-center">
                        {patient.gender}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {patient.contact_number}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          className="text-blue-600 hover:underline mr-3"
                          onClick={() =>
                            navigate(
                              `/dashboard-admin/edit/${patient.user_id}/patient`
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(patient.user_id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 border rounded ${
                  page === 1
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
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
