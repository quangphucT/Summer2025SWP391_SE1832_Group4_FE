import api from "../../config/api";
export const getAllAppointmentsFollowingDoctor = async (accountId) => {
  const response = await api.get("/api/appointments", {
    params: {
      accountId: accountId,
    },
  });

  return response;
};
