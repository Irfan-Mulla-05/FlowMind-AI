import { TIME_SLOTS } from "./constants.js";

export const slotWeightsByEnergy = {
  low: ["evening", "night", "afternoon", "morning"],
  normal: ["morning", "afternoon", "evening", "night"],
  high: ["morning", "afternoon", "evening", "night"]
};

export const getSuggestedSlot = ({ energyLevel = "normal", priority = "medium" }) => {
  const preferred = slotWeightsByEnergy[energyLevel] || TIME_SLOTS;
  if (priority === "urgent" || priority === "high") return preferred[0];
  return preferred[1] || "afternoon";
};

export const buildDailyPlanFallback = (tasks = [], user = {}) => {
  const plan = {
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityScore = { urgent: 4, high: 3, medium: 2, low: 1 };
    return (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
  });

  sortedTasks.forEach((task, index) => {
    const slot =
      task.preferredSlot ||
      getSuggestedSlot({
        energyLevel: task.energyLevel || user?.settings?.energyProfile || "normal",
        priority: task.priority
      });
    const safeSlot = TIME_SLOTS.includes(slot) ? slot : TIME_SLOTS[index % TIME_SLOTS.length];
    plan[safeSlot].push({
      taskId: task._id || task.id,
      title: task.title,
      duration: task.estimatedDuration || 45,
      reason: `Scheduled by fallback planner for ${safeSlot}.`
    });
  });

  return {
    plan,
    overloadWarning: sortedTasks.length > 8 ? "Your day looks overloaded. Consider moving 1-2 tasks." : null,
    guidance: "Fallback planner used. AI was unavailable, so tasks were balanced using urgency and energy."
  };
};
