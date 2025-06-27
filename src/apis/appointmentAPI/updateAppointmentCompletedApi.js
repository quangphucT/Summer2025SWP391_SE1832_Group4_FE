import api from "../../config/api"
export const updateAppointmentCompleted = async(id) =>{
   const response = await api.put(`/api/appointments/${id}/complete`)
   return response;
}