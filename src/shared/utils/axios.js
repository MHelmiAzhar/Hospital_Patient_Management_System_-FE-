import axios from "axios"
import secureLocalStorage from "react-secure-storage"

const instanceApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000
})

export const instanceApiToken = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000
})

instanceApiToken.interceptors.request.use((config) => {
    const data = secureLocalStorage.getItem('User')

    if(data.token) {
        config.headers.Authorization = `Bearer ${data.token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

export default instanceApi