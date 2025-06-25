import api from "../../config/api";
export const getAllAppointmentsConsultant = async (appointmentType = "Consultation") => {
  const response = await api.get("/api/appointments", {
    params: {
      appointmentType,
    },
  });

  return response;
};
