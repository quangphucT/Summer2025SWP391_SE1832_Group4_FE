import api from "../../config/api"

export const getAvailableSchedulesDoctorsTherapy = async (date, time,specialty = 'Therapy') => {

    const response = await api.get('/api/appointments/available', {
      params: {
        date: date,  // Ví dụ: "2025-06-17"
        time: time,
        specialty: specialty // default
      }
    });
    return response;
}