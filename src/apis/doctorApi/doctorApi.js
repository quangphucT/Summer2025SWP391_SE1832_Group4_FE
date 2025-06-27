import api from "../../config/api";

// Get all doctors with their details
export const getAllDoctors = async () => {
    try {
        const response = await api.get('/api/doctor/all');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAllDoctors failed:", msg);
        throw new Error(msg);
    }
};

// Get a specific doctor by ID
export const getDoctorById = async (id) => {
    try {
        const response = await api.get(`/api/doctor/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getDoctorById failed:", msg);
        throw new Error(msg);
    }
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (specialty) => {
    try {
        const response = await api.get(`/api/doctor/specialty/${specialty}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getDoctorsBySpecialty failed:", msg);
        throw new Error(msg);
    }
};
// Thêm vào file doctorApi.js
export const getDoctorByAccountId = async (accountId) => {
    try {
        const response = await api.get(`/api/doctor/account/${accountId}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getDoctorByAccountId failed:", msg);
        throw new Error(msg);
    }
};
