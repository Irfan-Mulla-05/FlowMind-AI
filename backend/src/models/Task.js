import mongoose from "mongoose";
import { ENERGY_LEVELS, TASK_PRIORITIES, TASK_STATUSES, TIME_SLOTS } from "../utils/constants.js";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: TASK_PRIORITIES, default: "medium" },
    category: { type: String, default: "General" },
    deadline: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    tags: [{ type: String }],
    status: { type: String, enum: TASK_STATUSES, default: "todo" },
    important: { type: Boolean, default: false },
    estimatedDuration: { type: Number, default: 45 },
    actualDuration: { type: Number, default: 0 },
    energyLevel: { type: String, enum: ENERGY_LEVELS, default: "normal" },
    preferredSlot: { type: String, enum: TIME_SLOTS, default: "morning" },
    recurrence: { type: String, default: "" },
    aiGenerated: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    linkedNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note", default: null },
    completedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
