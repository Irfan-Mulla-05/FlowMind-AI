export const storage = {
  getToken: () => localStorage.getItem("flowpilot_token"),
  setToken: (token) => localStorage.setItem("flowpilot_token", token),
  clearToken: () => localStorage.removeItem("flowpilot_token")
};
