import api from "../../config/api"

export const createAccountAutoSetPasswordApi = async(values) =>{
    const response = await api.post('/api/Auth/register-by-admin',values)
    return response;
}