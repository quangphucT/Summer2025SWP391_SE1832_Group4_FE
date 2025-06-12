import api from "../../config/api";

// Get all experience working records for a specific doctor
export const getDoctorExperienceWorking = async (doctorId) => {
    try {
        const response = await api.get(`/api/ExperienceWorking/doctor/${doctorId}`);
        const data = response.data;
        
        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        }
        if (data?.data && Array.isArray(data.data)) {
            return data.data;
        }
        console.warn("[API] Unexpected format in getDoctorExperienceWorking:", data);
        return [];
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getDoctorExperienceWorking failed:", msg);
        throw new Error(msg);
    }
};

// Update all experience working records for a specific doctor
export const updateDoctorExperienceWorking = async (doctorId, data) => {
    try {
        const response = await api.put(`/api/ExperienceWorking/doctor/${doctorId}`, data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updateDoctorExperienceWorking failed:", msg);
        throw new Error(msg);
    }
};

// Get a specific experience working record by ID
export const getExperienceWorkingById = async (id) => {
    try {
        const response = await api.get(`/api/ExperienceWorking/${id}`);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getExperienceWorkingById failed:", msg);
        throw new Error(msg);
    }
};

// Update an existing experience working record
export const updateExperienceWorking = async (id, data) => {
    try {
        const response = await api.put(`/api/ExperienceWorking/${id}`, data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updateExperienceWorking failed:", msg);
        throw new Error(msg);
    }
};

// Delete an experience working record
export const deleteExperienceWorking = async (id) => {
    try {
        const response = await api.delete(`/api/ExperienceWorking/${id}`);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] deleteExperienceWorking failed:", msg);
        throw new Error(msg);
    }
};

// Create a new experience working record
export const createExperienceWorking = async (data) => {
    try {
        const response = await api.post(`/api/ExperienceWorking`, data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] createExperienceWorking failed:", msg);
        throw new Error(msg);
    }
};
