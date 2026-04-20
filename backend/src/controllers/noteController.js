import { Note } from "../models/Note.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../services/activityService.js";

export const getNotes = asyncHandler(async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } }
        ]
      }
    : {};
  const notes = await Note.find({ user: req.user._id, ...search }).sort({ pinned: -1, updatedAt: -1 });
  res.json({ notes });
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({
    ...req.body,
    user: req.user._id
  });
  await logActivity(req.user._id, "note_created", `Created note "${note.title}"`, { noteId: note._id });
  res.status(201).json({ note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
    new: true
  });
  if (!note) throw new AppError("Note not found", 404);
  res.json({ note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  res.json({ message: "Note deleted" });
});

export const togglePinNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  note.pinned = !note.pinned;
  await note.save();
  res.json({ note });
});
