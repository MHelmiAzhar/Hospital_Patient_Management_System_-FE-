import { instanceApiToken } from "../../../shared/utils/axios"

export async function updateProfileDoctor(user_id, data) {
  const res = await instanceApiToken.put(`/user/update-doctor/${user_id}`, data)
  return res.data
}
