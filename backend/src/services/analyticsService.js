import { Task } from "../models/Task.js";
import { calculateProductivityScore } from "../utils/productivity.js";

const startOfRange = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getWeeklyAnalytics = async (userId) => {
  const startDate = startOfRange(6);
  const tasks = await Task.find({ user: userId, createdAt: { $gte: startDate } }).lean();
  const days = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayTasks = tasks.filter(
      (task) => new Date(task.createdAt).toDateString() === date.toDateString()
    );
    const completed = dayTasks.filter((task) => task.status === "completed").length;
    days.push({
      day: label,
      created: dayTasks.length,
      completed
    });
  }

  return days;
};

export const getAnalyticsInsights = async (userId, user) => {
  const tasks = await Task.find({ user: userId, status: { $ne: "archived" } }).lean();
  const completed = tasks.filter((task) => task.status === "completed");
  const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed");
  const byCategory = {};
  const bySlot = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  tasks.forEach((task) => {
    byCategory[task.category] = (byCategory[task.category] || 0) + 1;
    bySlot[task.preferredSlot] = (bySlot[task.preferredSlot] || 0) + (task.status === "completed" ? 1 : 0);
  });

  const score = calculateProductivityScore({
    completionRate: tasks.length ? (completed.length / tasks.length) * 100 : 0,
    overdueRate: tasks.length ? (overdue.length / tasks.length) * 100 : 0,
    streak: user.streak,
    consistencyScore: Math.min(100, completed.length * 8)
  });

  return {
    overview: score,
    monthlyCompletionTrend: tasks.slice(-30).map((task) => ({
      date: new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      completed: task.status === "completed" ? 1 : 0
    })),
    categoryProductivity: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
    completionByTimeSlot: Object.entries(bySlot).map(([slot, value]) => ({ slot, value })),
    overdueTrend: overdue.slice(0, 10).map((task) => ({
      title: task.title,
      dueDate: task.dueDate
    })),
    consistencyAnalysis: {
      currentStreak: user.streak,
      bestSlot: Object.entries(bySlot).sort((a, b) => b[1] - a[1])[0]?.[0] || "morning",
      recommendedAdjustment: score.score < 70 ? "Reduce overload and schedule hard work earlier." : "Keep protecting your best time slot."
    }
  };
};
