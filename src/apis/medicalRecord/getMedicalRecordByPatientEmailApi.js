import api from "../../config/api"
export const getMedicalRecordByPatientEmail = async(email) =>{
   const response = await api.get(`/api/medical-records/patient/${email}/unique`)
   return response;
}