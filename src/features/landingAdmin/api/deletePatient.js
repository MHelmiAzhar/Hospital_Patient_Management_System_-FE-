import { instanceApiToken } from "../../../shared/utils/axios"

export const deletePatient = async (id) => {
  const res = await instanceApiToken.delete(`/user/delete-patient/${id}`)
  return res.data
}
