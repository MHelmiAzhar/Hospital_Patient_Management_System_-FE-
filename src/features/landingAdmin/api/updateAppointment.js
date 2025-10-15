import { instanceApiToken } from '../../../shared/utils/axios'


export const updateAppointmentByAdmin = async (id, data) => {
  const res = await instanceApiToken.put(`/appointment/${id}/admin`, data)
  return res.data
}
