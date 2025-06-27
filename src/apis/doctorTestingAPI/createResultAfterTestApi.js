import api from "../../config/api"

export const createResultAfterTest = async(values) =>{
    const response = await api.post("/api/test-result",values)
    return response;
}