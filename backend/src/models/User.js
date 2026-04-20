import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { LIFE_MODES, PRODUCTIVITY_PERIODS, USER_ROLES } from "../utils/constants.js";
import { calculateLevelFromXp } from "../utils/productivity.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: USER_ROLES, default: "Professional" },
    lifeMode: { type: String, enum: LIFE_MODES, default: "Developer Mode" },
    avatar: { type: String, default: "" },
    preferredTheme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    preferredProductivityPeriod: { type: String, enum: PRODUCTIVITY_PERIODS, default: "morning" },
    xp: { type: Number, default: 120 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    achievements: [{ type: String }],
    settings: {
      browserNotifications: { type: Boolean, default: false },
      reminderMinutes: { type: Number, default: 30 },
      energyProfile: { type: String, enum: ["low", "normal", "high"], default: "normal" }
    },
    aiPreferences: {
      provider: { type: String, default: "openai" },
      autoBreakdown: { type: Boolean, default: true },
      autoReschedule: { type: Boolean, default: true },
      planningStyle: { type: String, default: "balanced" }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function saveHook(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified("xp")) {
    this.level = calculateLevelFromXp(this.xp);
  }

  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
