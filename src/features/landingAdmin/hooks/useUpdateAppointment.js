import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAppointmentByAdmin } from '../api/updateAppointment'

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateAppointmentByAdmin(id, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointment'])
    }
  })
}
