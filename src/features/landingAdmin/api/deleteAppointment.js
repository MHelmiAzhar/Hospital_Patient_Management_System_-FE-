import { instanceApiToken } from "../../../shared/utils/axios"

export const deleteAppointment = async (appointmentId) => {
  const res = await instanceApiToken.delete(`appointment/${appointmentId}`)
    return res.data
}
