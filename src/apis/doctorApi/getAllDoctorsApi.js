import api from "../../config/api"

export const getAllDoctorsApi = async() =>{
    const response = await api.get("/api/doctor/all")
    return response;
}