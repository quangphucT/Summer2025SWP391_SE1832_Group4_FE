import api from "../../config/api"
export const confirmAppointment = async(id) =>{
   const response = await api.put(`/api/appointments/${id}/schedule`)
   return response;
}