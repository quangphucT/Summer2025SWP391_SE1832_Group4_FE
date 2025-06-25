import api from "../../config/api"

export const getAvailableSchedulesDoctorsTesting = async (date, time,specialty = 'Testing') => {

    const response = await api.get('/api/appointments/available', {
      params: {
        date: date,  // Ví dụ: "2025-06-17"
        time: time,
        specialty: specialty // default
      }
    });
    return response;
}