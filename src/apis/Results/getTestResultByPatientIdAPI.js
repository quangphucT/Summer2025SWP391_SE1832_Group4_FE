import api from "../../config/api"
export const getTestResultByPatientId = async(patientId) =>{
   const response = await api.get(`/api/test-result/patient/${patientId}`)
   return response;
}