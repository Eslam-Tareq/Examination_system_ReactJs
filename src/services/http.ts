import axios from "axios";
import { storage } from "@/utils/storage";

const http = axios.create({
  //@ts-ignore
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Token)
http.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor (Global Errors)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default http;
