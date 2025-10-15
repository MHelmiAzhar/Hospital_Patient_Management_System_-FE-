import { instanceApiToken } from "../../../shared/utils/axios"

export const deleteDoctor = async (id) => {
  const res = await instanceApiToken.delete(`/user/delete-doctor/${id}`)
  return res.data
}
