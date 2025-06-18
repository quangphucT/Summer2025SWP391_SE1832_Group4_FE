import api from "../../config/api"
export const checkInAppointment = async(id) =>{
   const response = await api.put(`/api/appointments/${id}/checkin`)
   return response;
}