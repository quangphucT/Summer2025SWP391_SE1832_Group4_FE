import api from "../../config/api";

/**
 * GET /api/accounts
 * Luôn trả về một Array (có thể rỗng)
 */
export async function getAllAccounts(queryString = "") {
  const url = `/api/accounts${queryString ? `?${queryString}` : ""}`;
  console.log("[API] GET →", api.defaults.baseURL + url);

  try {
    const res  = await api.get(url);
    const body = res.data;
    console.log("[API] 200 GET /api/accounts payload:", body);

    // 1) nếu trả thẳng mảng
    if (Array.isArray(body)) {
      return body;
    }

    // 2) nếu wrapper kiểu { data: { items: [...] } }
    if (body.data?.items && Array.isArray(body.data.items)) {
      return body.data.items;
    }

    // 3) nếu wrapper kiểu { data: { accounts: [...] } }
    if (body.data?.accounts && Array.isArray(body.data.accounts)) {
      return body.data.accounts;
    }

    console.warn("[API] Unexpected format, returning []:", body);
    return [];
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error("[API] GET /api/accounts failed:", msg);
    throw new Error(msg);
  }
}

export async function updateAccountById(id, data) {
  const url = `/api/accounts/${id}`;
  console.log("[API] PUT →", api.defaults.baseURL + url, "body:", data);
  try {
    const res = await api.put(url, data);
    console.log(`[API] PUT /api/accounts/${id} status:`, res.status);
    return res.status === 204 ? null : res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error(`[API] PUT /api/accounts/${id} failed:`, msg);
    throw new Error(msg);
  }
}

export async function deleteAccountById(id) {
  const url = `/api/accounts/${id}`;
  console.log("[API] DELETE →", api.defaults.baseURL + url);
  try {
    const res = await api.delete(url);
    console.log(`[API] DELETE /api/accounts/${id} status:`, res.status);
    return null;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Unknown error";
    console.error(`[API] DELETE /api/accounts/${id} failed:`, msg);
    throw new Error(msg);
  }
}


