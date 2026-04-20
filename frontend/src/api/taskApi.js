import { api } from "./client";

export const taskApi = {
  getAll: async (params) => (await api.get("/tasks", { params })).data,
  create: async (payload) => (await api.post("/tasks", payload)).data,
  update: async (id, payload) => (await api.put(`/tasks/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/tasks/${id}`)).data,
  toggleComplete: async (id) => (await api.patch(`/tasks/${id}/toggle-complete`)).data,
  toggleImportant: async (id) => (await api.patch(`/tasks/${id}/toggle-important`)).data,
  reorder: async (taskIds) => (await api.patch("/tasks/reorder", { taskIds })).data,
  duplicate: async (id) => (await api.patch(`/tasks/${id}/duplicate`)).data
};
