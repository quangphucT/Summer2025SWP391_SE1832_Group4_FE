import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true, // Bật nếu cần gửi cookie/JWT
  //... other axios options
});
// Trước khi gọi API, thêm token vào headers
api.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = sessionStorage.getItem("token")
  if(token){
      config.headers.Authorization = `Bearer ${token}`
  }
  
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
export default api;
