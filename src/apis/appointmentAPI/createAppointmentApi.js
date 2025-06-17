import api from "../../config/api"
export const createAppointment = async(values) =>{
   const response = await api.post("/api/appointments",values)
   return response;
}