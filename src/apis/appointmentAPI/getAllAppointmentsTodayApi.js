import api from "../../config/api"
export const getAllAppointmentsToday = async() =>{
   const response = await api.get("/api/appointments/today")
   return response;
}