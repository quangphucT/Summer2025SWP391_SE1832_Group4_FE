import api from "../../config/api"
export const getMedicalRecordByPatientPhone = async(phone) =>{
   const response = await api.get(`/api/medical-records/patient/${phone}/unique`)
   return response;
}