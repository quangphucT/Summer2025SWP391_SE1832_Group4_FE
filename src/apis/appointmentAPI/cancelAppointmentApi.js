import api from "../../config/api"
export const cancelAppointment = async(id) =>{
   const response = await api.delete(`/api/appointments/${id}`)
   return response;
}