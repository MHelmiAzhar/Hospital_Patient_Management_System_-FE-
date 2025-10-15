import { useQuery } from "@tanstack/react-query"
import { getAllDoctors } from "../api/getAllDoctors"

export const useGetAllDoctor = ({ search = '', page, size } = {}) => {
    return useQuery({
        queryKey: ['doctors', { search, page, size }],
        queryFn: () => getAllDoctors({ search, page, size }),
        keepPreviousData: true
    })
}