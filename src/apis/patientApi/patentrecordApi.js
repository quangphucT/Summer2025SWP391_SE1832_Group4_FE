import api from "../../config/api";

// Get all patient records
export const getAllPatientRecords = async () => {
    try {
        const response = await api.get('/api/patientrecords');
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

// Get patient records by patient ID
export const getPatientRecordsByPatientId = async (patientId) => {
    try {
        const response = await api.get(`/api/patientrecords/patient/${patientId}`);
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

// Create a new patient record
export const createPatientRecord = async (data) => {
    try {
        const response = await api.post('/api/patientrecords', data);
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

// Get a specific patient record by ID
export const getPatientRecordById = async (id) => {
    try {
        const response = await api.get(`/api/patientrecords/${id}`);
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

// Update an existing patient record
export const updatePatientRecord = async (id, data) => {
    try {
        const response = await api.put(`/api/patientrecords/${id}`, data);
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

// Delete a patient record
export const deletePatientRecord = async (id) => {
    try {
        const response = await api.delete(`/api/patientrecords/${id}`);
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
