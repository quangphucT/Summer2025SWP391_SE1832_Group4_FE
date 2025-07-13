import api from "../../config/api";
 
export const getSuggestedRegimens = (data) => {
  return api.post("/api/standard-arv-regimens/suggest-regimens", data);
}; 