import { instanceApiToken } from "../../../shared/utils/axios"

export const updatePatient = async (id, data) => {
  const res = await instanceApiToken.put(`/user/update-patient/${id}`, data)
  return res.data
}