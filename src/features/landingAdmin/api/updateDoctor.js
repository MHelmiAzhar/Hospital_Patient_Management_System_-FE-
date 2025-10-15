import { instanceApiToken } from '../../../shared/utils/axios'

export const getUserById = async (id) => {
  const res = await instanceApiToken.get(`/user/detail/${id}/`)
  return res.data
}

export const updateDoctor = async (id, data) => {
  const res = await instanceApiToken.put(`/user/update-doctor/${id}`, data)
  return res.data
}
