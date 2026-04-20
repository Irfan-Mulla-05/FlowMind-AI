import { api } from "./client";

export const noteApi = {
  getAll: async (params) => (await api.get("/notes", { params })).data,
  create: async (payload) => (await api.post("/notes", payload)).data,
  update: async (id, payload) => (await api.put(`/notes/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/notes/${id}`)).data,
  togglePin: async (id) => (await api.patch(`/notes/${id}/pin`)).data
};
