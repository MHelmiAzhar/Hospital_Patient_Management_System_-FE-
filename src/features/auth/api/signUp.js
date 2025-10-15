import instanceApi from "../../../shared/utils/axios"

export const signUp = async (data) => instanceApi.post('/auth/register-patient', data).then(res => res.data)
