import { useMutation } from "@tanstack/react-query"
import { signIn } from "../api/signIn"

export const useSignIn = () => {
    const { mutateAsync, isPending, isError, error } = useMutation({
        mutationFn: (data) => signIn(data)
    })
    return { mutateAsync, isPending, isError, error}
}