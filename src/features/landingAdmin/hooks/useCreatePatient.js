import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPatient } from "../api/createPatient"

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"])
    }
  })
  return { mutateAsync, isPending, isError, error }
}
