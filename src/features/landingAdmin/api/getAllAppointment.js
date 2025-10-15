import { instanceApiToken } from "../../../shared/utils/axios"

export const getAllAppointments = async (params) =>
    instanceApiToken.get('/appointment', { params }).then(res => res.data)
