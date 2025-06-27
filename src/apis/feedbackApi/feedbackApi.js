import api from '../../config/api';

// GET /api/feedback
export const getFeedbacks = async (params) => {
    try {
        const response = await api.get('/api/feedback', { params });
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getFeedbacks failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/feedback/{id}
export const getFeedbackById = async (id) => {
    try {
        const response = await api.get(`/api/feedback/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getFeedbackById failed:", msg);
        throw new Error(msg);
    }
};

// POST /api/feedback
export const createFeedback = async (data) => {
    try {
        const response = await api.post('/api/feedback', data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] createFeedback failed:", msg);
        throw new Error(msg);
    }
};

// PUT /api/feedback/{id}
export const updateFeedback = async (id, data) => {
    try {
        const response = await api.put(`/api/feedback/${id}`, data);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] updateFeedback failed:", msg);
        throw new Error(msg);
    }
};

// DELETE /api/feedback/{id}
export const deleteFeedback = async (id) => {
    try {
        const response = await api.delete(`/api/feedback/${id}`);
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] deleteFeedback failed:", msg);
        throw new Error(msg);
    }
};
