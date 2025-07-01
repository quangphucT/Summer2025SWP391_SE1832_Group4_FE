import api from "../../config/api"

export const createTherapyForPatient = async(values) =>{
    const response = await api.post("/api/appointments/doctor",values);
    return response;
}