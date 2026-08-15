export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date";

export const priorityTone = {
  low: "text-sky-300 bg-sky-500/10",
  medium: "text-amber-300 bg-amber-500/10",
  high: "text-orange-300 bg-orange-500/10",
  urgent: "text-rose-300 bg-rose-500/10"
};
