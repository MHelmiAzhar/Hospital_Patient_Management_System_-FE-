import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../api/getAllUsers"
import { getAllAppointments } from "../api/getAllAppointment"

export const useGetAllAppointments = ({ date = '', status = '', page, limit , appointment_id} = {}) => {
    return useQuery({
        queryKey: ['appointment', { date, status, page, limit, appointment_id }],
        queryFn: () => getAllAppointments({ date, status, page, limit, appointment_id }),
        keepPreviousData: true
    })
}