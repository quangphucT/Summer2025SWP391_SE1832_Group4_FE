import api from "../../config/api"
export const getAllAppointmentsOfCustomer = async() =>{
   const response = await api.get("/api/appointments/by-account")
   return response;
}