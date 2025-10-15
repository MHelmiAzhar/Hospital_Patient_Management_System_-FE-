import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAppointment } from "../api/createAppointment"

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment"] })
    }
  })
  return { mutateAsync, isPending, isError, error }
}
