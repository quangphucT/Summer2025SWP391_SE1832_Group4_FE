import api from "../../config/api";

// Get all experience working records for a specific doctor
export const getDoctorExperienceWorking = (doctorId) => {
    return api.get(`/api/ExperienceWorking/doctor/${doctorId}`)
        .then(response => response.data);
};

// Update all experience working records for a specific doctor
export const updateDoctorExperienceWorking = (doctorId, data) => {
    return api.put(`/api/ExperienceWorking/doctor/${doctorId}`, data)
        .then(response => response.data);
};

// Get a specific experience working record by ID
export const getExperienceWorkingById = (id) => {
    return api.get(`/api/ExperienceWorking/${id}`)
        .then(response => response.data);
};

// Update an existing experience working record
export const updateExperienceWorking = (id, data) => {
    return api.put(`/api/ExperienceWorking/${id}`, data)
        .then(response => response.data);
};

// Delete an experience working record
export const deleteExperienceWorking = (id) => {
    return api.delete(`/api/ExperienceWorking/${id}`)
        .then(response => response.data);
};

// Create a new experience working record
export const createExperienceWorking = (data) => {
    return api.post(`/api/ExperienceWorking`, data)
        .then(response => response.data);
};
