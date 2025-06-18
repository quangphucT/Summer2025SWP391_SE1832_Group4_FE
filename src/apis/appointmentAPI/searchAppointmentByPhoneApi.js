import api from "../../config/api"
export const searchAppointmentByPhone = async(phoneNumber) =>{
   const response = await api.get("/api/appointments/today",{
      params: {
        phoneNumber
      }
    })
   return response;
}