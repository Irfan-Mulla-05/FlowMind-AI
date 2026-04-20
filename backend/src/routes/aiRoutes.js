import { Router } from "express";
import {
  breakdownTask,
  futureRoadmap,
  habitSuggestions,
  planDay,
  productivityScore,
  reschedule,
  voiceToTask
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { breakdownValidation, futureRoadmapValidation, planDayValidation, voiceValidation } from "../validations/aiValidation.js";

const router = Router();

router.use(protect);
router.post("/breakdown-task", breakdownValidation, validateRequest, breakdownTask);
router.post("/plan-day", planDayValidation, validateRequest, planDay);
router.post("/reschedule", reschedule);
router.post("/productivity-score", productivityScore);
router.post("/habit-suggestions", habitSuggestions);
router.post("/future-roadmap", futureRoadmapValidation, validateRequest, futureRoadmap);
router.post("/voice-to-task", voiceValidation, validateRequest, voiceToTask);

export default router;
