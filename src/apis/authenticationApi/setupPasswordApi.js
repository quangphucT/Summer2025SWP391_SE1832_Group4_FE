import api from "../../config/api"
export const setupPassworApi = async (values, token) => {
    const response = await api.post("/Auth/set-password", values, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
