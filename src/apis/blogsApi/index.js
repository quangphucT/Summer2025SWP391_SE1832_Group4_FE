import api from "../../config/api";

export async function getAllBlogs(queryString = "") {
    const url = `/api/blogs${queryString ? `?${queryString}` : ""}`;
    console.log("[API] GET →", api.defaults.baseURL + url);
  
    try {
      const res  = await api.get(url);
      const body = res.data;
      console.log("[API] 200 GET /api/blogs payload:", body);
  
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
      console.error("[API] GET /api/blogs failed:", msg);
      throw new Error(msg);
    }
  }
  export async function createBlog(data) {
    const url = `/api/blogs`;
    console.log("[API] POST →", api.defaults.baseURL + url);
    try {
      const res = await api.post(url, data);
      console.log(`[API] POST /api/blogs status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] POST /api/blogs failed:`, msg);
      throw new Error(msg);
    }
  }
  export async function updateBlogById(id, data) {
    const url = `/api/blogs/${id}`;
    console.log("[API] PUT →", api.defaults.baseURL + url, "body:", data);
    try {
      const res = await api.put(url, data);
      console.log(`[API] PUT /api/blogs/${id} status:`, res.status);
      return res.status === 204 ? null : res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] PUT /api/blogs/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  
  export async function deleteBlogById(id) {
    const url = `/api/blogs/${id}`;
    console.log("[API] DELETE →", api.defaults.baseURL + url);
    try {
      const res = await api.delete(url);
      console.log(`[API] DELETE /api/blogs/${id} status:`, res.status);
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      console.error(`[API] DELETE /api/blogs/${id} failed:`, msg);
      throw new Error(msg);
    }
  }
  