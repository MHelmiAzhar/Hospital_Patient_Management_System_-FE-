import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useGetAllAppointments } from '../hooks/useGetAllAppointment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAppointment } from '../api/deleteAppointment'

export default function AppointmentTable() {
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const size = 10
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Call hook with pagination
  const { data, isLoading, isError, error } = useGetAllAppointments({
    date,
    status,
    page,
    size
  })

  const appointments = data?.data?.appointments || []
  const pagination = data?.data?.pagination || {}

  // Mutation for deleting appointment
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAppointment(id),
    onSuccess: () => {
      alert('Appointment deleted successfully!')
      queryClient.invalidateQueries(['appointments']) // refresh data
    },
    onError: (error) => {
      alert(
        'Failed to delete appointment: ' +
          (error.response?.data?.message || error.message)
      )
    }
  })

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <p>Loading appointments...</p>
  if (isError) return <p>Error loading appointments: {error.message}</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Manage Appointments</h2>
        <Link
          to="./create/appointment"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Appointment
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setPage(1)
          }}
          className="border border-gray-300 px-3 py-2 rounded-md"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="border border-gray-300 px-3 py-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {(date || status) && (
          <button
            onClick={() => {
              setDate('')
              setStatus('')
              setPage(1)
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Appointment Table */}
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3 text-left">No</th>
            <th className="py-2 px-3 text-left">Patient</th>
            <th className="py-2 px-3 text-left">Doctor</th>
            <th className="py-2 px-3 text-left">Date</th>
            <th className="py-2 px-3 text-left">Time</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length ? (
            appointments.map((appointment, index) => {
              let timeString = ''
              if (appointment.date) {
                const match = appointment.date.match(/T?(\d{2}):(\d{2})/)
                if (match) timeString = `${match[1]}:${match[2]}`
              }

              return (
                <tr
                  key={appointment.appointment_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-2 px-3">
                    {(page - 1) * size + (index + 1)}
                  </td>
                  <td className="py-2 px-3">{appointment.patient?.name}</td>
                  <td className="py-2 px-3">{appointment.doctor?.name}</td>
                  <td className="py-2 px-3">
                    {(() => {
                      const d = new Date(appointment.date)
                      const day = String(d.getDate()).padStart(2, '0')
                      const month = String(d.getMonth() + 1).padStart(2, '0')
                      const year = d.getFullYear()
                      return `${day}/${month}/${year}`
                    })()}
                  </td>
                  <td className="py-2 px-3">{timeString}</td>
                  <td className="py-2 px-3 capitalize">{appointment.status}</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard-admin/edit/${appointment.appointment_id}/appointment`
                        )
                      }
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.appointment_id)}
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
              <td colSpan="7" className="text-center text-gray-500 py-4 italic">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
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
            onClick={() => setPage((p) => p + 1)}
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
    </div>
  )
}
