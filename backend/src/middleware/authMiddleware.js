import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(new AppError("Not authorized", 401));
    }

    const token = header.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      return next(new AppError("Invalid or expired token", 401));
    }

    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
