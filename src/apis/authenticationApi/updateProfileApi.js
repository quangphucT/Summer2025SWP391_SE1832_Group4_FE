import api from "../../config/api"
export const updateProfileApi = async(id,values) =>{
    const response = await api.put(`/api/accounts/${id}`,values)
    return response;
}