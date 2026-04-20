import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    payload: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const AIInsight = mongoose.model("AIInsight", aiInsightSchema);
