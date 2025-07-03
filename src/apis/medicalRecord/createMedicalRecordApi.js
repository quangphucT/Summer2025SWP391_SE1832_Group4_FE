import api from "../../config/api"
export const createMedicalRecord = async(patientId,values) =>{
   const response = await api.post(`/api/medical-records/patient/${patientId}/from-test-result`,values)
   return response;
}