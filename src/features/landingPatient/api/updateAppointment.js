import { instanceApiToken } from '../../../shared/utils/axios'


export const updateAppointment = async (id, data) => {
  const res = await instanceApiToken.put(`/appointment/${id}`, data)
  return res.data
}
