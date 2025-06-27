import api from "../../config/api";

// Get all medical records
export const getAllPatientRecords = async () => {
    try {
        const response = await api.get('/api/medical-records');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAllPatientRecords failed:", msg);
        throw new Error(msg);
    }
};

// Get medical records by patient ID
export const getPatientRecordsByPatientId = async (patientId) => {
    try {
        const response = await api.get(`/api/medical-records/patient/${patientId}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return data;
        }
        if (data?.data && Array.isArray(data.data)) {
            return data.data;
        }
        console.warn("[API] Unexpected format in getPatientRecordsByPatientId:", data);
        return [];
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientRecordsByPatientId failed:", msg);
        throw new Error(msg);
    }
};

// Get medical records by doctor ID
export const getPatientRecordsByDoctorId = async (doctorId) => {
    try {
        const response = await api.get(`/api/medical-records/doctor/${doctorId}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return data;
        }
        if (data?.data && Array.isArray(data.data)) {
            return data.data;
        }
        console.warn("[API] Unexpected format in getPatientRecordsByDoctorId:", data);
        return [];
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientRecordsByDoctorId failed:", msg);
        throw new Error(msg);
    }
};

// Create a new medical record
export const createPatientRecord = async (data) => {
    try {
        const response = await api.post('/api/medical-records', data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] createPatientRecord failed:", msg);
        throw new Error(msg);
    }
};

// Get a specific medical record by ID
export const getPatientRecordById = async (id) => {
    try {
        const response = await api.get(`/api/medical-records/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientRecordById failed:", msg);
        throw new Error(msg);
    }
};

// Update an existing medical record
export const updatePatientRecord = async (id, data) => {
    try {
        const response = await api.put(`/api/medical-records/${id}`, data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updatePatientRecord failed:", msg);
        throw new Error(msg);
    }
};

// Delete a medical record
export const deletePatientRecord = async (id) => {
    try {
        const response = await api.delete(`/api/medical-records/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] deletePatientRecord failed:", msg);
        throw new Error(msg);
    }
};
