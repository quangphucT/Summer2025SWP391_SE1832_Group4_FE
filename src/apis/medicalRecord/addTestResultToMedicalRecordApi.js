import api from "../../config/api"

export const addTestResultToMedicalRecord = async(id,value) =>{
    const response = await api.post(`/api/medical-records/${id}/add-test-result`,value);
    return response;
}