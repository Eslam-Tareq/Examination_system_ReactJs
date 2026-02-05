import axios from "axios";
import { storage } from "@/utils/storage";
import { useToastStore } from "@/store/toast.store";

const http = axios.create({
// @ts-expect-error
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// Request Interceptor
// =====================
http.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// Response Interceptor
// =====================
http.interceptors.response.use(
  (response) => {
    // 🔔 Success Toast (اختياري)
    // لو مش عايزه، سيبه commented

    const message = response.data?.message;
    if (message) {
      useToastStore.getState().showToast(message, "success");
    }

    return response;
  },
  (error) => {
    const { response } = error;

    let message = "Something went wrong";
    let title = "Error";

    if (response) {
      const status = response.status;

      message = response.data?.message || response.statusText || message;

      if (status === 401) {
        title = "Unauthorized";
        message = "Please login again";

        // optional: auto logout
        storage.removeToken();
        // window.location.href = "/login";
      }

      if (status === 403) {
        title = "Access denied";
        message = "You don't have permission";
      }

      if (status >= 500) {
        title = "Server error";
      }
    }

    // 🔔 Error Toast (GLOBAL)
    useToastStore.getState().showToast(message, "error", title);

    return Promise.reject(error);
  },
);

export default http;
