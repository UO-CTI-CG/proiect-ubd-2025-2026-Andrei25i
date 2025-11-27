import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/reset-password", 
    "/forgot-password"
];

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    const isPublicRequest = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    if (token && !isPublicRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isPublicRequest = originalRequest && publicEndpoints.some(endpoint => originalRequest.url.includes(endpoint));

    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isPublicRequest
    ) {
      originalRequest._retry = true;
      useAuthStore.getState().logout();
      window.location.href = "/login?expired=true";
    }

    return Promise.reject(error);
  }
);

export default api;
