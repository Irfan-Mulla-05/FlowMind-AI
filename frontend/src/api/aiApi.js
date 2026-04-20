import { api } from "./client";

export const aiApi = {
  breakdownTask: async (payload) => (await api.post("/ai/breakdown-task", payload)).data,
  planDay: async (payload) => (await api.post("/ai/plan-day", payload)).data,
  reschedule: async (payload) => (await api.post("/ai/reschedule", payload)).data,
  productivityScore: async (payload) => (await api.post("/ai/productivity-score", payload)).data,
  habitSuggestions: async () => (await api.post("/ai/habit-suggestions")).data,
  futureRoadmap: async (payload) => (await api.post("/ai/future-roadmap", payload)).data,
  voiceToTask: async (payload) => (await api.post("/ai/voice-to-task", payload)).data
};
