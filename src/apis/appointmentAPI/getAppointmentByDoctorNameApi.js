import api from "../../config/api";

export const getAllAppointmentsByDoctorName = async (doctorName) => {
  const response = await api.get("/api/appointments", {
    params: {
      doctorName: doctorName,
    },
  });
  return response;
}; 