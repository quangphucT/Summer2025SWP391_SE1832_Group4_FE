import api from "../../config/api"
export const resetPassword = async (values, token) => {
    const response = await api.post("/api/Auth/reset-password", values, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
