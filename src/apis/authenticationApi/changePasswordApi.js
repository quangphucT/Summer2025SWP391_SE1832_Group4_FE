import api from "../../config/api"

export const changePasswordApi = async(id,values) =>{
    const response = await api.post(`/api/Auth/change-password/${id}`,values)
    return response;
}