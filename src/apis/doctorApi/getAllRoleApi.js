import api from "../../config/api"

export const getAllRolesApi = async() =>{
    const response = await api.get("/api/Auth/roles");
    return response;
}