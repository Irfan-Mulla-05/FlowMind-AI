import { Router } from "express";
import { analyticsInsights, weeklyAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/weekly", protect, weeklyAnalytics);
router.get("/insights", protect, analyticsInsights);

export default router;
