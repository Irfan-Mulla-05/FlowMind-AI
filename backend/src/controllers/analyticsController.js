import { getAnalyticsInsights, getWeeklyAnalytics } from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const weeklyAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getWeeklyAnalytics(req.user._id);
  res.json({ analytics });
});

export const analyticsInsights = asyncHandler(async (req, res) => {
  const insights = await getAnalyticsInsights(req.user._id, req.user);
  res.json(insights);
});
