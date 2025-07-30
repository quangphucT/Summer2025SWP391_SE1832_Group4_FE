import api from '../../config/api';

// GET /api/dashboard/statistics/appointment-by-month
export const getAppointmentStatsByMonth = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/appointment-by-month');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAppointmentStatsByMonth failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/patient-by-month
export const getPatientStatsByMonth = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/patient-by-month');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientStatsByMonth failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/test-result-by-month
export const getTestResultStatsByMonth = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/test-result-by-month');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTestResultStatsByMonth failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/appointment-by-day
export const getAppointmentStatsByDay = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/appointment-by-day');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAppointmentStatsByDay failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/patient-by-day
export const getPatientStatsByDay = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/patient-by-day');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientStatsByDay failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/test-result-by-day
export const getTestResultStatsByDay = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/test-result-by-day');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTestResultStatsByDay failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/appointment-by-year
export const getAppointmentStatsByYear = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/appointment-by-year');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getAppointmentStatsByYear failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/patient-by-year
export const getPatientStatsByYear = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/patient-by-year');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getPatientStatsByYear failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/test-result-by-year
export const getTestResultStatsByYear = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/test-result-by-year');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTestResultStatsByYear failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard
export const getDashboard = async () => {
    try {
        const response = await api.get('/api/dashboard');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getDashboard failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/test-result-summary
export const getTestResultSummary = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/test-result-summary');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTestResultSummary failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/treatments
export const getTreatments = async () => {
    try {
        const response = await api.get('/api/dashboard/treatments');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTreatments failed:", msg);
        throw new Error(msg);
    }
};

// GET /api/dashboard/statistics/treatment-status-count
export const getTreatmentStatusCount = async () => {
    try {
        const response = await api.get('/api/dashboard/statistics/treatment-status-count');
        return response;
    } catch (err) {
        if (!err.response) {
            throw new Error("Could not establish connection. Please check your internet connection.");
        }
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        console.error("[API] getTreatmentStatusCount failed:", msg);
        throw new Error(msg);
    }
};


