import { body } from "express-validator";

export const noteValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").optional().isString()
];
