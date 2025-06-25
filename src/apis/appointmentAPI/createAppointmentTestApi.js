import api from "../../config/api"
export const createAppointmentTest = async(values) =>{
   const response = await api.post("/api/appointments/doctor",values)
   return response;
}