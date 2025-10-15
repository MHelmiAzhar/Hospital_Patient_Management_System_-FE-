import { instanceApiToken } from "../../../shared/utils/axios"

export const getAllDoctors = async (params) =>
    instanceApiToken.get(`/user/all-doctor`, {params}).then(res => res.data)
