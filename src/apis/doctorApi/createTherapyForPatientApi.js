import api from "../../config/api"

export const createTherapyForPatient = async() =>{
    const response = await api.post("/api/appointments/doctor");
    return response;
}