import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../api/getAllUsers"

export const useDoctor = ({ search = '', role = 'DOCTOR', page, size } = {}) => {
    return useQuery({
        queryKey: ['doctors', { search, role, page, size }],
        queryFn: () => getAllUsers({ search, role, page, size }),
        keepPreviousData: true
    })
}