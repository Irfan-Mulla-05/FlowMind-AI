import { AIInsight } from "../models/AIInsight.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Note } from "../models/Note.js";
import { Task } from "../models/Task.js";
import { calculateProductivityScore } from "../utils/productivity.js";
import { roleConfig } from "../utils/roleConfig.js";

export const getDashboardSummary = async (user) => {
  const [tasks, notes, activities, aiInsights] = await Promise.all([
    Task.find({ user: user._id, status: { $ne: "archived" } }).sort({ orderIndex: 1, createdAt: -1 }).lean(),
    Note.find({ user: user._id }).sort({ pinned: -1, updatedAt: -1 }).limit(6).lean(),
    ActivityLog.find({ user: user._id }).sort({ createdAt: -1 }).limit(8).lean(),
    AIInsight.find({ user: user._id }).sort({ createdAt: -1 }).limit(4).lean()
  ]);

  const now = new Date();
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const pendingTasks = tasks.filter((task) => task.status !== "completed");
  const overdueTasks = pendingTasks.filter((task) => task.dueDate && new Date(task.dueDate) < now);
  const completionPercentage = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const completionRate = completionPercentage;
  const overdueRate = tasks.length ? Math.round((overdueTasks.length / tasks.length) * 100) : 0;
  const consistencyScore = Math.min(100, Math.round((completedTasks.length / Math.max(1, pendingTasks.length)) * 45 + user.streak * 3));
  const productivity = calculateProductivityScore({
    completionRate,
    overdueRate,
    streak: user.streak,
    consistencyScore
  });

  const weeklyMap = new Map();
  const trendMap = new Map();
  const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
  const categoryMap = {};
  const slotMap = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  for (const task of tasks) {
    const day = new Date(task.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    weeklyMap.set(day, (weeklyMap.get(day) || 0) + (task.status === "completed" ? 1 : 0));

    const monthDay = new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    trendMap.set(monthDay, (trendMap.get(monthDay) || 0) + 1);

    priorityMap[task.priority] = (priorityMap[task.priority] || 0) + 1;
    categoryMap[task.category] = (categoryMap[task.category] || 0) + 1;
    slotMap[task.preferredSlot] = (slotMap[task.preferredSlot] || 0) + 1;
  }

  const suggestedFocusTasks = pendingTasks
    .sort((a, b) => Number(b.important) - Number(a.important) || new Date(a.dueDate || now) - new Date(b.dueDate || now))
    .slice(0, 4);

  return {
    stats: {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      overdueTasks: overdueTasks.length,
      completionPercentage,
      productivityScore: productivity.score,
      xp: user.xp,
      level: user.level,
      streak: user.streak
    },
    charts: {
      weeklyProductivity: Array.from(weeklyMap, ([day, value]) => ({ day, value })),
      taskTrend: Array.from(trendMap, ([date, value]) => ({ date, value })),
      priorityDistribution: Object.entries(priorityMap).map(([name, value]) => ({ name, value })),
      categoryBreakdown: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
      slotBreakdown: Object.entries(slotMap).map(([name, value]) => ({ name, value }))
    },
    aiInsights: aiInsights.length
      ? aiInsights
      : roleConfig[user.role]?.suggestions.map((suggestion, index) => ({
          _id: `${user.role}-${index}`,
          title: `${user.role} Insight`,
          summary: suggestion
        })),
    pinnedNotes: notes.filter((note) => note.pinned).slice(0, 3),
    upcomingDeadlines: pendingTasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5),
    activityTimeline: activities,
    suggestedFocusTasks,
    productivity
  };
};
