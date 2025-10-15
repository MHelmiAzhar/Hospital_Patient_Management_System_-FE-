import { instanceApiToken } from '../../../shared/utils/axios'


export const updateStatusAppointmentByDoctor = async (id, data) => {
  const res = await instanceApiToken.patch(`/appointment/${id}/status`, data)
  return res.data
}
