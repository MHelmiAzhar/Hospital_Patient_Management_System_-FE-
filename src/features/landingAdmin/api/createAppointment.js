import { instanceApiToken } from "../../../shared/utils/axios"

export const createAppointment = async (data) => {
  try {
    const res = await instanceApiToken.post("/appointment", data)
    return res.data
  } catch (err) {
    const beMsg = err?.response?.data?.message
    const message = beMsg || err.message || 'Failed to create appointment'
    throw new Error(message)
  }
}
