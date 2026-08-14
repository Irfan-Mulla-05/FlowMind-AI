import mongoose from "mongoose";

const productivityMetricSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    completionRate: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    overdueTasks: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
    focusMinutes: { type: Number, default: 0 },
    slotBreakdown: {
      morning: { type: Number, default: 0 },
      afternoon: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      night: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export const ProductivityMetric = mongoose.model("ProductivityMetric", productivityMetricSchema);
