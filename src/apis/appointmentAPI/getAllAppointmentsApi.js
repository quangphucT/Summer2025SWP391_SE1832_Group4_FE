import api from "../../config/api"
export const getAllAppointments = async() =>{
   const response = await api.get("/api/appointments")
   return response;
}