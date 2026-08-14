import { body } from "express-validator";
import { ENERGY_LEVELS, TASK_PRIORITIES, TASK_STATUSES, TIME_SLOTS } from "../utils/constants.js";

export const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("priority").optional().isIn(TASK_PRIORITIES),
  body("status").optional().isIn(TASK_STATUSES),
  body("energyLevel").optional().isIn(ENERGY_LEVELS),
  body("preferredSlot").optional().isIn(TIME_SLOTS)
];
