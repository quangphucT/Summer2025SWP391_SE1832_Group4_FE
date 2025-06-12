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

// Get certificates by doctor ID
export const getCertificatesByDoctorId = async (doctorId) => {
    try {
        const response = await api.get(`/api/certificates/doctor/${doctorId}`);
        const data = response.data;
        
        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        }
        if (data?.data && Array.isArray(data.data)) {
            return data.data;
        }
        console.warn("[API] Unexpected format in getCertificatesByDoctorId:", data);
        return [];
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getCertificatesByDoctorId failed:", msg);
        throw new Error(msg);
    }
};

// Create a new certificate
export const createCertificate = async (data) => {
    try {
        console.log('Creating certificate with data:', data); // Debug log
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
