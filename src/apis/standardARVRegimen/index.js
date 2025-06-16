import api from "../../config/api";

export async function getAllStandardARVRegimen(queryString = "") {
    const url = `/api/standard-arv-regimens${queryString ? `?${queryString}` : ""}`;
    console.log("[API] GET →", api.defaults.baseURL + url);
  
    try {
      const res  = await api.get(url);
      const body = res.data;
      console.log("[API] 200 GET /api/standard-arv-regimens payload:", body);
  
      if (Array.isArray(body)) {
        return body;
      }
      if (body.data?.items && Array.isArray(body.data.items)) {
        return body.data.items;
      }
      if (body.data?.blogs && Array.isArray(body.data.blogs)) {
        return body.data.blogs;
      }
      console.warn("[API] Unexpected format, returning []:", body);
      return [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error("[API] GET /api/standard-arv-regimens failed:", msg);
      throw new Error(msg);
    }
  }
  export async function CreateStandardARVRegimen(data) {
    const url = `/api/standard-arv-regimens`;
    console.log("[API] POST →", api.defaults.baseURL + url);
    try {
      const res = await api.post(url, data);
      console.log(`[API] POST /api/standard-arv-regimens status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] POST /api/standard-arv-regimens failed:`, msg);
      throw new Error(msg);
    }
  }
  export async function updateStandardARVRegimenById(id, data) {
    const url = `/api/standard-arv-regimens/${id}`;
    console.log("[API] PUT →", api.defaults.baseURL + url, "body:", data);
    try {
      const res = await api.put(url, data);
      console.log(`[API] PUT /api/standard-arv-regimens/${id} status:`, res.status);
      return res.status === 204 ? null : res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] PUT /api/standard-arv-regimens/${id} failed:`, msg);
      throw new Error(msg);
    }
  }

  export async function deleteStandardARVRegimenById(id) {
    const url = `/api/standard-arv-regimens/${id}`;
    console.log("[API] DELETE →", api.defaults.baseURL + url);
    try {
      const res = await api.delete(url);
      console.log(`[API] DELETE /api/standard-arv-regimens/${id} status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] DELETE /api/standard-arv-regimens/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  