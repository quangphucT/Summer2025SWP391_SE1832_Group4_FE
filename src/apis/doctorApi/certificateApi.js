import api from "../../config/api";

// Get all certificates
export const getAllCertificates = async () => {
    try {
        const response = await api.get('/api/certificates');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAllCertificates failed:", msg);
        throw new Error(msg);
    }
};

// Create a new certificate
export const createCertificate = async (data) => {
    try {
        const response = await api.post('/api/certificates', data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] createCertificate failed:", msg);
        throw new Error(msg);
    }
};

// Get a specific certificate by ID
export const getCertificateById = async (id) => {
    try {
        const response = await api.get(`/api/certificates/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getCertificateById failed:", msg);
        throw new Error(msg);
    }
};

// Update an existing certificate
export const updateCertificate = async (id, data) => {
    try {
        const response = await api.put(`/api/certificates/${id}`, data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updateCertificate failed:", msg);
        throw new Error(msg);
    }
};

// Delete a certificate
export const deleteCertificate = async (id) => {
    try {
        const response = await api.delete(`/api/certificates/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] deleteCertificate failed:", msg);
        throw new Error(msg);
    }
};
