import api from "../../config/api";
export const getAllAppointmentsTesting = async (appointmentType = "Testing") => {
  const response = await api.get("/api/appointments", {
    params: {
      appointmentType,
    },
  });

  return response;
};
