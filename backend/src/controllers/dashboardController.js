import { getDashboardSummary } from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user);
  res.json(summary);
});
