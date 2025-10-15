import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDoctor } from "../api/createDoctor"

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data) => createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"])
    }
  })
  return { mutateAsync, isPending, isError, error }
}
