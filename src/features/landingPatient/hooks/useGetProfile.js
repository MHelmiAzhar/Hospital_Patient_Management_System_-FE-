import { useQuery } from "@tanstack/react-query"
import { getProfileUser } from "../api/getProfileUser"

export const useGetProfile = (id) => {
    return useQuery({
        queryKey: ['profile', { id }],
        queryFn: () => getProfileUser(id),
        keepPreviousData: true
    })
}