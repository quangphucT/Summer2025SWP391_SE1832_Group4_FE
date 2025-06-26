import api from "../../config/api"

export const createAccountDoctorFollowingType = async() =>{
    const response = await api.post("/api/doctor")
    return response;
}