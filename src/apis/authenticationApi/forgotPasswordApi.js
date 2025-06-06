import api from "../../config/api"
export const forgotPassword = async(values) =>{
   const response = await api.post("/api/Auth/forgot-password",values)
   return response;
}