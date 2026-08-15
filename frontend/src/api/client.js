import axios from "axios";
import { storage } from "../utils/storage";

const resolveBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) return configuredUrl;
  return "/api";
};

export const api = axios.create({
  baseURL: resolveBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Cannot connect to the server. Make sure the backend is running.";
    }
    return Promise.reject(error);
  }
);
