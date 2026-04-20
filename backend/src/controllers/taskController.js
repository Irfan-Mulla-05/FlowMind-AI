import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../services/activityService.js";

const taskQueryFromRequest = (req) => {
  const query = {
    user: req.user._id
  };

  if (req.query.status && req.query.status !== "all") {
    query.status =
      req.query.status === "pending"
        ? { $in: ["todo", "in_progress"] }
        : req.query.status;
  }
  if (req.query.search) query.title = { $regex: req.query.search, $options: "i" };
  if (req.query.important) query.important = req.query.important === "true";
  return query;
};

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find(taskQueryFromRequest(req)).sort({ orderIndex: 1, createdAt: -1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const lastTask = await Task.findOne({ user: req.user._id }).sort({ orderIndex: -1 });
  const task = await Task.create({
    ...req.body,
    user: req.user._id,
    orderIndex: lastTask ? lastTask.orderIndex + 1 : 1
  });

  await logActivity(req.user._id, "task_created", `Created task "${task.title}"`, { taskId: task._id });
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
    new: true
  });
  if (!task) throw new AppError("Task not found", 404);

  await logActivity(req.user._id, "task_updated", `Updated task "${task.title}"`, { taskId: task._id });
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError("Task not found", 404);

  await logActivity(req.user._id, "task_deleted", `Deleted task "${task.title}"`, { taskId: task._id });
  res.json({ message: "Task deleted" });
});

export const toggleCompleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError("Task not found", 404);

  task.status = task.status === "completed" ? "todo" : "completed";
  task.completedAt = task.status === "completed" ? new Date() : null;
  await task.save();

  if (task.status === "completed") {
    req.user.xp += task.important ? 40 : 20;
    req.user.streak += 1;
    await req.user.save();
  }

  await logActivity(req.user._id, "task_completion_toggled", `${task.status === "completed" ? "Completed" : "Reopened"} "${task.title}"`, {
    taskId: task._id
  });

  res.json({ task });
});

export const toggleImportantTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError("Task not found", 404);
  task.important = !task.important;
  await task.save();
  res.json({ task });
});

export const reorderTasks = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;
  if (!Array.isArray(taskIds)) throw new AppError("taskIds must be an array", 422);

  const updates = taskIds.map((taskId, index) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(taskId), user: req.user._id },
      update: { orderIndex: index + 1 }
    }
  }));

  if (updates.length) await Task.bulkWrite(updates);
  const tasks = await Task.find({ user: req.user._id }).sort({ orderIndex: 1 });
  res.json({ tasks });
});

export const duplicateTask = asyncHandler(async (req, res) => {
  const sourceTask = await Task.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!sourceTask) throw new AppError("Task not found", 404);
  delete sourceTask._id;
  delete sourceTask.createdAt;
  delete sourceTask.updatedAt;

  const duplicate = await Task.create({
    ...sourceTask,
    title: `${sourceTask.title} (Copy)`,
    status: "todo"
  });

  res.status(201).json({ task: duplicate });
});
