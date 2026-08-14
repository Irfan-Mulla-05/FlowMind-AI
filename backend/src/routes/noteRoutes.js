import { Router } from "express";
import { createNote, deleteNote, getNotes, togglePinNote, updateNote } from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { noteValidation } from "../validations/noteValidation.js";

const router = Router();

router.use(protect);
router.get("/", getNotes);
router.post("/", noteValidation, validateRequest, createNote);
router.put("/:id", noteValidation, validateRequest, updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", togglePinNote);

export default router;
