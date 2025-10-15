import { useState } from 'react'
import { useGetAllAppointments } from '../../landingAdmin/hooks/useGetAllAppointment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatusAppointmentByDoctor } from '../api/updateStatusAppointment'

export default function AppointmentDoctor() {
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const size = 10
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

  // Mutation for updating appointment status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      updateStatusAppointmentByDoctor(id, { status }),
    onSuccess: (data, variables) => {
      const statusText =
        variables.status === 'APPROVED' ? 'approved' : 'rejected'
      alert(`Appointment ${statusText} successfully!`)
      queryClient.invalidateQueries(['appointments'])
    },
    onError: (error) => {
      alert(
        'Failed to update appointment: ' +
          (error.response?.data?.message || error.message)
      )
    }
  })

  const handleUpdateStatus = (id, newStatus) => {
    const action = newStatus === 'APPROVED' ? 'approve' : 'reject'
    if (confirm(`Are you sure you want to ${action} this appointment?`)) {
      updateStatusMutation.mutate({ id, status: newStatus })
    }
  }

  if (isLoading) return <p>Loading appointments...</p>
  if (isError) return <p>Error loading appointments: {error.message}</p>

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-5xl mx-auto">
      <h2 className="flex text-lg font-semibold mb-4 justify-center">
        Appointment With Patient
      </h2>

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

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-center">No</th>
            <th className="px-3 py-2 text-center">Date</th>
            <th className="px-3 py-2 text-center">Time</th>
            <th className="px-3 py-2 text-center">Status</th>
            <th className="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length ? (
            appointments.map((appointment, index) => {
              const rowNumber = (page - 1) * size + (index + 1)
              let timeString = ''
              if (appointment.date) {
                const match = appointment.date.match(/T?(\d{2}):(\d{2})/)
                if (match) timeString = `${match[1]}:${match[2]}`
              }
              return (
                <tr
                  key={appointment?.appointment_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-2 px-3 text-center">{rowNumber}</td>

                  <td className="py-2 px-3 text-center">
                    {(() => {
                      const d = new Date(appointment.date)
                      const day = String(d.getDate()).padStart(2, '0')
                      const month = String(d.getMonth() + 1).padStart(2, '0')
                      const year = d.getFullYear()
                      return `${day}/${month}/${year}`
                    })()}
                  </td>
                  <td className="py-2 px-3 text-center">{timeString} WIB</td>
                  <td className="py-2 px-3 text-center">
                    {appointment.status}
                  </td>
                  <td className=" flex py-2 px-3 justify-center items-center gap-2">
                    {(appointment.status || '').toUpperCase() ===
                    'SCHEDULED' ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              appointment.appointment_id,
                              'APPROVED'
                            )
                          }
                          className="text-green-600 hover:underline mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              appointment.appointment_id,
                              'REJECTED'
                            )
                          }
                          className="text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <p className="flex rounded-3xl p-1 px-3 bg-green-800 w-fit justify-center text-white">
                        No Need action
                      </p>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="6" className="border px-3 py-2 text-center">
                No appointments found.
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
