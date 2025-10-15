import { instanceApiToken } from "../../../shared/utils/axios"

export const createDoctor = async (data) => {
  const res = await instanceApiToken.post("/user/create-doctor", data)
  .then(res => res.data)
}
