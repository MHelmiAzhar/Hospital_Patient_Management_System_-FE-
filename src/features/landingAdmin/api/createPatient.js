import { instanceApiToken } from "../../../shared/utils/axios"

export const createPatient = async (data) => {
  const res = await instanceApiToken.post("/auth/register-patient", data)
  .then(res => res.data)
}
