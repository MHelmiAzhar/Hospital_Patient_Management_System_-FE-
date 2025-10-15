import secureLocalStorage from "react-secure-storage"

export const useAuth = () => {
  const user = secureLocalStorage.getItem("User")
  
  return {
    user_id: user?.user?.user_id,
    isAuthenticated: !!user,
    role: user?.user?.role || null,
  }
}
