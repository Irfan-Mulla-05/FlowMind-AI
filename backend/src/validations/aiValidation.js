import { body } from "express-validator";

export const breakdownValidation = [body("goal").trim().notEmpty().withMessage("Goal is required")];
export const planDayValidation = [body("tasks").isArray({ min: 1 }).withMessage("Tasks array is required")];
export const futureRoadmapValidation = [body("goal").trim().notEmpty(), body("months").isInt({ min: 1, max: 24 })];
export const voiceValidation = [body("transcript").trim().notEmpty().withMessage("Transcript is required")];
