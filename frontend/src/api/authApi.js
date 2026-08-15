import { api } from "./client";

export const authApi = {
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  me: async () => (await api.get("/auth/me")).data,
  updateProfile: async (payload) => (await api.put("/auth/profile", payload)).data
};
