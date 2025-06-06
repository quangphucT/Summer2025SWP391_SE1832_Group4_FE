// src/apis/accountsApi/index.js
import api from "../../config/api";

/**
 * GET /api/accounts
 * @param {string} queryString - ví dụ: "username=foo&accountStatus=0"
 * @returns {Promise<Array|Object>}
 */
export async function getAllAccounts(queryString = "") {
  try {
    const url = `/api/accounts${queryString ? `?${queryString}` : ""}`;
    console.log("[DEBUG] GET →", api.defaults.baseURL + url);

    // axios trả về { data, status, ... }
    const response = await api.get(url);
    console.log("[DEBUG] Status GET:", response.status);
    console.log("[DEBUG] GET /api/accounts returned:", response.data);

    // Giống logic cũ: nếu backend trả cấu trúc wrapper { data: { accounts: [...] } }
    // hoặc trả mảng trực tiếp, chúng ta vẫn normalize được:
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data?.accounts) {
      return response.data.data.accounts;
    } else if (response.data?.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else {
      console.warn("[WARNING] Unexpected response format:", response.data);
      return [];
    }
  } catch (err) {
    
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error("[ERROR] Failed to GET /api/accounts:", message);
    throw new Error(message);
  }
}

/**
 * GET /api/accounts/{id}
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function getAccountById(id) {
  try {
    const url = `/api/accounts/${id}`;
    console.log("[DEBUG] GET →", api.defaults.baseURL + url);

    const response = await api.get(url);
    console.log(`[DEBUG] Status GET /api/accounts/${id}:`, response.status);
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error(`[ERROR] Failed to GET /api/accounts/${id}:`, message);
    throw new Error(message);
  }
}

/**
 * PUT /api/accounts/{id}
 * @param {number|string} id
 * @param {Object} data  Ví dụ: { username: "...", email: "..." }
 * @returns {Promise<Object|null>}
 */
export async function updateAccountById(id, data) {
  try {
    const url = `/api/accounts/${id}`;
    console.log("[DEBUG] PUT →", api.defaults.baseURL + url, "body:", data);

    const response = await api.put(url, data);
    console.log(`[DEBUG] Status PUT /api/accounts/${id}:`, response.status);

    // Nếu backend trả 204 No Content, axios trả status=204, data sẽ rỗng
    if (response.status === 204) {
      return null;
    }
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error(`[ERROR] Failed to PUT /api/accounts/${id}:`, message);
    throw new Error(message);
  }
}

/**
 * DELETE /api/accounts/{id}
 * @param {number|string} id
 * @returns {Promise<null>}
 */
export async function deleteAccountById(id) {
  try {
    const url = `/api/accounts/${id}`;
    console.log("[DEBUG] DELETE →", api.defaults.baseURL + url);

    const response = await api.delete(url);
    console.log(`[DEBUG] Status DELETE /api/accounts/${id}:`, response.status);
    return null;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error(`[ERROR] Failed to DELETE /api/accounts/${id}:`, message);
    throw new Error(message);
  }
}
