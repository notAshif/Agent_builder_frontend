import axios from "axios";

const DEFAULT_LOCAL_API_URL = "http://localhost:3000/api/v1";
const DEFAULT_PRODUCTION_API_URL = "https://agent-builder-backend.vercel.app/api/v1";

const isLocalHost = () => {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
};

const appendApiVersion = (url: string) => {
  const normalizedUrl = url.replace(/\/+$/, "");
  return normalizedUrl.endsWith("/api/v1") ? normalizedUrl : `${normalizedUrl}/api/v1`;
};

const API_BASE_URL = appendApiVersion(
  import.meta.env.VITE_API_URL || (isLocalHost() ? DEFAULT_LOCAL_API_URL : DEFAULT_PRODUCTION_API_URL)
);
export { API_BASE_URL };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
