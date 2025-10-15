import { instanceApiToken } from "../../../shared/utils/axios"

export const getProfileUser = async (id) =>
    instanceApiToken.get(`/user/detail/${id}`).then(res => res.data)
