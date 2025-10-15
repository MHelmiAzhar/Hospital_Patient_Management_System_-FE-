import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../api/getAllUsers"

export const usePatient = ({ search = '', role = 'PATIENT', page, size } = {}) => {
    return useQuery({
        queryKey: ['patients', { search, role, page, size }],
        queryFn: () => getAllUsers({ search, role, page, size }),
        keepPreviousData: true
    })
}