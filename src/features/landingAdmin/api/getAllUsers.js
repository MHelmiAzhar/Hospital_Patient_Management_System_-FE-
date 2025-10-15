import { instanceApiToken } from "../../../shared/utils/axios"

export const getAllUsers = async (params) =>
    instanceApiToken.get('/user', { params }).then(res => res.data)
