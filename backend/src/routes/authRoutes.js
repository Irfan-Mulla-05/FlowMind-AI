import { Router } from "express";
import { getMe, login, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidation, registerValidation } from "../validations/authValidation.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
