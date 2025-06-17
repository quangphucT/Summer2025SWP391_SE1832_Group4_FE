import api from "../../config/api"
export const getAllAppointments = async(values) =>{
   const response = await api.get("/api/appointments",values)
   return response;
}