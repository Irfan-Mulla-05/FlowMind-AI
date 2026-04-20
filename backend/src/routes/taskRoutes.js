import { Router } from "express";
import {
  createTask,
  deleteTask,
  duplicateTask,
  getTasks,
  reorderTasks,
  toggleCompleteTask,
  toggleImportantTask,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { taskValidation } from "../validations/taskValidation.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.post("/", taskValidation, validateRequest, createTask);
router.patch("/reorder", reorderTasks);
router.put("/:id", taskValidation, validateRequest, updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle-complete", toggleCompleteTask);
router.patch("/:id/toggle-important", toggleImportantTask);
router.patch("/:id/duplicate", duplicateTask);

export default router;
