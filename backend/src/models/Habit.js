import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    cadence: { type: String, default: "daily" },
    trigger: { type: String, default: "" },
    successCount: { type: Number, default: 0 },
    aiSuggested: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Habit = mongoose.model("Habit", habitSchema);
