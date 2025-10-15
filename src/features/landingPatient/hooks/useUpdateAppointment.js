import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAppointment } from '../api/updateAppointment'

export const useUpdateAppointmentPatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateAppointment(id, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointment'])
    }
  })
}
