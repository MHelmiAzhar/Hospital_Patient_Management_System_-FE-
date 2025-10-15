import { instanceApiToken } from "../../../shared/utils/axios"

export async function updateProfile(user_id, data) {
  const res = await instanceApiToken.put(`/user/update-patient/${user_id}`, data)
  return res.data
}
