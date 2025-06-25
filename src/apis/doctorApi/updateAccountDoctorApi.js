import api from "../../config/api";

export const updateAccountDoctor = async (id, specialty, values) => {
  const response = await api.put(
    `/api/doctor/${id}`,
    values, // body
    {
      params: {
        specialty: specialty
      }
    }
  );
  return response;
};
