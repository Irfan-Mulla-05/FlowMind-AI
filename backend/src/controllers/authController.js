import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";

const authResponse = (user) => ({
  token: signToken(user._id),
  user
});

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) throw new AppError("Email already in use", 409);

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    ...req.body,
    email: req.body.email.trim().toLowerCase(),
    password: hashedPassword
  });
  const safeUser = await User.findById(user._id).select("-password");

  res.status(201).json(authResponse(safeUser));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  const passwordMatch = await user.comparePassword(req.body.password);
  if (!passwordMatch) throw new AppError("Invalid credentials", 401);

  // Repair legacy records that may have been saved unhashed during earlier local runs.
  if (!/^\$2[aby]\$\d{2}\$/.test(user.password)) {
    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
  }

  const safeUser = await User.findById(user._id).select("-password");
  res.json(authResponse(safeUser));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "avatar", "preferredTheme", "preferredProductivityPeriod", "role", "lifeMode", "settings", "aiPreferences"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  await req.user.save();
  const safeUser = await User.findById(req.user._id).select("-password");
  res.json({ user: safeUser });
});
