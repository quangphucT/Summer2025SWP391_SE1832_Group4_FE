import api from "../../config/api"
export const findMedicalRecordByPatientId = async(id) =>{
   const response = await api.get(`/api/medical-records/patient/${id}`)
   return response;
}