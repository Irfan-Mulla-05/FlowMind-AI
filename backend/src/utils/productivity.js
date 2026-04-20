export const calculateLevelFromXp = (xp = 0) => Math.max(1, Math.floor(xp / 250) + 1);

export const calculateProductivityScore = ({
  completionRate = 0,
  overdueRate = 0,
  streak = 0,
  consistencyScore = 0
}) => {
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(completionRate * 0.4 + (100 - overdueRate) * 0.25 + Math.min(streak * 4, 20) + consistencyScore * 0.15)
    )
  );

  const suggestions = [];
  if (completionRate < 60) suggestions.push("Reduce daily task load and focus on the top 3 priorities.");
  if (overdueRate > 25) suggestions.push("Move difficult tasks into your strongest focus window.");
  if (streak < 3) suggestions.push("Aim for one small win daily to rebuild your streak.");
  if (suggestions.length === 0) suggestions.push("Maintain your rhythm and protect your highest focus block.");

  return {
    score,
    summary:
      score >= 80
        ? "You are operating with strong consistency and healthy follow-through."
        : score >= 60
          ? "Your productivity is solid, with room to improve consistency and deadline control."
          : "You may be carrying too much cognitive load. A lighter, more focused plan would help.",
    suggestions
  };
};
