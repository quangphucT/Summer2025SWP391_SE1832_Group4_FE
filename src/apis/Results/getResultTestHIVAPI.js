import api from "../../config/api"
export const getResultTestHIV = async(id) =>{
   const response = await api.get(`/api/test-result/appointment/${id}`)
   return response;
}