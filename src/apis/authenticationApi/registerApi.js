import api from "../../config/api"

export const register = async(values) =>{
    const response = await api.post("/api/Auth/register", values)
    return response;
}