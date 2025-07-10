import api from "../../config/api";

// Lấy chi tiết treatment theo id
export const getPatientTreatmentById = async (id) => {
  if (!id) return null;
  try {
    const res = await api.get(`/api/patient-treatments/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error("Error fetching treatment detail:", err);
    return null;
  }
};
