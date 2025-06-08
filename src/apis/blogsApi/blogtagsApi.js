import api from "../../config/api";

export async function getAllBlogTags(queryString = "") {
    const url = `/api/blogtags${queryString ? `?${queryString}` : ""}`;
    console.log("[API] GET →", api.defaults.baseURL + url);
  
    try {
      const res  = await api.get(url);
      const body = res.data;
      console.log("[API] 200 GET /api/blogtags payload:", body);
  
      if (Array.isArray(body)) {
        return body;
      }
      if (body.data?.items && Array.isArray(body.data.items)) {
        return body.data.items;
      }
      if (body.data?.blogTags && Array.isArray(body.data.blogTags)) {
        return body.data.blogTags;
      }
      console.warn("[API] Unexpected format, returning []:", body);
      return [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error("[API] GET /api/blogtags failed:", msg);
      throw new Error(msg);
    }
  }
  export async function createBlogTag(data) {
    const url = `/api/blogtags`;
    console.log("[API] POST →", api.defaults.baseURL + url);
    try {
      const res = await api.post(url, data);
      console.log(`[API] POST /api/blogtags status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] POST /api/blogtags failed:`, msg);
      throw new Error(msg);
    }
  }
  export async function updateBlogTagById(id, data) {
    const url = `/api/blogtags/${id}`;
    console.log("[API] PUT →", api.defaults.baseURL + url, "body:", data);
    try {
      const res = await api.put(url, data);
      console.log(`[API] PUT /api/blogtags/${id} status:`, res.status);
      return res.status === 204 ? null : res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] PUT /api/blogtags/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  
  export async function deleteBlogTagById(id) {
    const url = `/api/blogtags/${id}`;
    console.log("[API] DELETE →", api.defaults.baseURL + url);
    try {
      const res = await api.delete(url);
      console.log(`[API] DELETE /api/blogtags/${id} status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] DELETE /api/blogtags/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
                                 