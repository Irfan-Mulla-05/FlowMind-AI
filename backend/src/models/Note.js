import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "<p></p>" },
    pinned: { type: Boolean, default: false },
    tags: [{ type: String }],
    linkedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
