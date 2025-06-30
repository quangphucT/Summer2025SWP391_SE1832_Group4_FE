import api from "../../config/api"
export const getMedicalRecordByPatientId = async(id) =>{
   const response = await api.get(`/api/medical-records/patient/${id}/unique`)
   return response;
}