import instanceApi from "../../../shared/utils/axios"

export const signIn = async (data) => instanceApi.post('/auth/login', data).then(res => res.data)
