import api from "../../config/api";

export async function getAllScheduledActivities(queryString = "") {
    const url = `/api/scheduled-activities${queryString ? `?${queryString}` : ""}`;
    console.log("[API] GET →", api.defaults.baseURL + url);
  
    try {
      const res  = await api.get(url);
      const body = res.data;
      console.log("[API] 200 GET /api/scheduled-activities payload:", body);
  
      if (Array.isArray(body)) {
        return body;
      }
      if (Array.isArray(body.data)) {
        return body.data;
      }
      if (body.data?.items && Array.isArray(body.data.items)) {
        return body.data.items;
      }
    if (body.data?.scheduledActivities && Array.isArray(body.data.scheduledActivities)) {
        return body.data.scheduledActivities;
      }
      console.warn("[API] Unexpected format, returning []:", body);
      return [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error("[API] GET /api/scheduled-activities failed:", msg);
      throw new Error(msg);
    }
  }
  export async function createScheduledActivity(data) {
    const url = `/api/scheduled-activities`;
    console.log("[API] POST →", api.defaults.baseURL + url);
    try {
      const res = await api.post(url, data);
      console.log(`[API] POST /api/scheduled-activities status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] POST /api/scheduled-activities failed:`, msg);
      throw new Error(msg);
    }
  }
  export async function updateScheduledActivityById(id, data) {
    const url = `/api/scheduled-activities/${id}`;
    console.log("[API] PUT →", api.defaults.baseURL + url, "body:", data);
    try {
      const res = await api.put(url, data);
      console.log(`[API] PUT /api/scheduled-activities/${id} status:`, res.status);
      return res.status === 204 ? null : res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] PUT /api/scheduled-activities/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  
  export async function deleteScheduledActivityById(id) {
    const url = `/api/scheduled-activities/${id}`;
    console.log("[API] DELETE →", api.defaults.baseURL + url);
    try {
      const res = await api.delete(url);
      console.log(`[API] DELETE /api/scheduled-activities/${id} status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
        console.error(`[API] DELETE /api/scheduled-activities/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  