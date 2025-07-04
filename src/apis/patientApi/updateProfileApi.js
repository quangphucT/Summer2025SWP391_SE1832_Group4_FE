import api from "../../config/api";

// Update patient profile by ID
export const updateProfilePatient = async (id, data) => {
    try {
        const response = await api.put(`/api/patients/${id}`, data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updateProfilePatient failed:", msg);
        throw new Error(msg);
    }
};

// Get patient by accountId
export const getPatientByAccountId = async (accountId) => {
    try {
        const response = await api.get(`/api/patients/account/${accountId}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientByAccountId failed:", msg);
        throw new Error(msg);
    }
};
