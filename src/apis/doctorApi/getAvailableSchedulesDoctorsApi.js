import api from "../../config/api"

export const getAvailableSchedulesDoctors = async (date, time) => {

    const response = await api.get('/api/appointments/available', {
      params: {
        date: date,  // Ví dụ: "2025-06-17"
        time: time   // Ví dụ: "08:00:00"
      }
    });
    return response;
}
