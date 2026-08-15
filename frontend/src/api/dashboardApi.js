import { api } from "./client";

export const dashboardApi = {
  summary: async () => (await api.get("/dashboard/summary")).data,
  weekly: async () => (await api.get("/analytics/weekly")).data,
  insights: async () => (await api.get("/analytics/insights")).data
};
