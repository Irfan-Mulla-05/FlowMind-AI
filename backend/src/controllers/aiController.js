import { AIInsight } from "../models/AIInsight.js";
import { Habit } from "../models/Habit.js";
import { Task } from "../models/Task.js";
import { aiService } from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const storeInsight = async (userId, type, title, summary, payload) => {
  await AIInsight.create({
    user: userId,
    type,
    title,
    summary,
    payload
  });
};

export const breakdownTask = asyncHandler(async (req, res) => {
  const result = await aiService.breakdownTask({ goal: req.body.goal, user: req.user });
  await storeInsight(req.user._id, "breakdown", "AI Task Breakdown", result.summary, result);
  res.json(result);
});

export const planDay = asyncHandler(async (req, res) => {
  const result = await aiService.planDay({
    tasks: req.body.tasks,
    user: req.user,
    energyLevel: req.body.energyLevel || req.user.settings?.energyProfile || "normal"
  });
  await storeInsight(req.user._id, "planner", "AI Day Planner", result.guidance, result);
  res.json(result);
});

export const reschedule = asyncHandler(async (req, res) => {
  const tasks = req.body.tasks?.length
    ? req.body.tasks
    : await Task.find({ user: req.user._id, dueDate: { $lt: new Date() }, status: { $ne: "completed" } }).lean();
  const result = await aiService.rescheduleTasks({ tasks, user: req.user });
  await storeInsight(req.user._id, "reschedule", "AI Rescheduler", result.summary, result);
  res.json(result);
});

export const productivityScore = asyncHandler(async (req, res) => {
  const result = await aiService.productivityScore({ metrics: req.body });
  await storeInsight(req.user._id, "score", "AI Productivity Score", result.summary, result);
  res.json(result);
});

export const habitSuggestions = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(12).lean();
  const result = await aiService.habitSuggestions({ tasks, user: req.user });
  await Promise.all(
    result.habits.map((habit) =>
      Habit.create({
        user: req.user._id,
        title: habit.title,
        cadence: habit.cadence,
        trigger: habit.reason,
        aiSuggested: true
      })
    )
  );
  res.json(result);
});

export const futureRoadmap = asyncHandler(async (req, res) => {
  const result = await aiService.futureRoadmap({
    goal: req.body.goal,
    months: Number(req.body.months || 6),
    user: req.user
  });
  await storeInsight(req.user._id, "roadmap", "Future You Roadmap", result.summary, result);
  res.json(result);
});

export const voiceToTask = asyncHandler(async (req, res) => {
  const result = await aiService.voiceToTask({
    transcript: req.body.transcript,
    user: req.user
  });
  res.json(result);
});
