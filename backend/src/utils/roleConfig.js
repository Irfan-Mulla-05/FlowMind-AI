export const roleConfig = {
  Student: {
    templates: ["Study Sprint", "Revision Block", "Exam Countdown"],
    categories: ["Study", "Assignments", "Revision", "Practice"],
    suggestions: [
      "Schedule revision before your highest focus slot.",
      "Break heavy study goals into 45 minute sessions."
    ]
  },
  Developer: {
    templates: ["Deep Work Session", "Sprint Deliverables", "Bug Bash"],
    categories: ["Coding", "Review", "Debugging", "Learning"],
    suggestions: [
      "Protect one uninterrupted deep work block today.",
      "Group review and debugging into lower-energy windows."
    ]
  },
  Professional: {
    templates: ["Meeting Prep", "Priority Queue", "Weekly Review"],
    categories: ["Meetings", "Strategy", "Execution", "Admin"],
    suggestions: [
      "Batch similar work to reduce context switching.",
      "Place high-stakes work early in your preferred productivity window."
    ]
  }
};

export const lifeModeConfig = {
  "Student Mode": {
    plannerBias: "study_blocks",
    focus: "learning"
  },
  "Developer Mode": {
    plannerBias: "deep_work",
    focus: "shipping"
  },
  "Fitness Mode": {
    plannerBias: "energy_cycles",
    focus: "health"
  }
};
