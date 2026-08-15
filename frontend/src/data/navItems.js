import {
  BarChart3,
  BrainCircuit,
  LayoutDashboard,
  NotebookText,
  Settings,
  SquareCheckBig
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Tasks", to: "/app/tasks", icon: SquareCheckBig },
  { label: "Planner", to: "/app/planner", icon: BrainCircuit },
  { label: "Notes", to: "/app/notes", icon: NotebookText },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
  { label: "Settings", to: "/app/settings", icon: Settings }
];
