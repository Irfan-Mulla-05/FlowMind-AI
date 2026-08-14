import OpenAI from "openai";
import { env } from "../config/env.js";
import { buildDailyPlanFallback, getSuggestedSlot } from "../utils/planner.js";
import { calculateProductivityScore } from "../utils/productivity.js";
import { roleConfig } from "../utils/roleConfig.js";

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
};

const promptWithSchema = (instruction, schema) => `
You are an expert productivity planner. Return only valid JSON.
Instruction: ${instruction}
Required JSON shape:
${JSON.stringify(schema, null, 2)}
`;

const fallbackTaskPatterns = [
  /\bstudy\s+(?:for\s+)?(?:the\s+)?(.+?)(?=\s+(?:water|have|eat|cook|finish|revise|complete|submit|call|email|clean|wash|buy|go|read|write)\b|$)/gi,
  /\b(?:water|have|eat|cook|finish|revise|complete|submit|call|email|clean|wash|buy|go|read|write)\b(?:\s+(?:the|a|an|my|your))?\s+[^,.]+?(?=\s+(?:study|water|have|eat|cook|finish|revise|complete|submit|call|email|clean|wash|buy|go|read|write)\b|$)/gi
];

const cleanupTaskTitle = (value) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\bform exam\b/gi, "for exam")
    .trim();

const splitGoalIntoTasks = (goal = "") => {
  const normalized = cleanupTaskTitle(goal);
  if (!normalized) return [];

  const directParts = normalized
    .split(/\s*(?:,|;|\n|\band then\b|\bthen\b|\band\b)\s*/i)
    .map(cleanupTaskTitle)
    .filter(Boolean);
  if (directParts.length > 1) return directParts;

  const matches = fallbackTaskPatterns.flatMap((pattern) => {
    pattern.lastIndex = 0;
    return [...normalized.matchAll(pattern)].map((match) => cleanupTaskTitle(match[0]));
  });

  return matches.length ? [...new Set(matches)] : [normalized];
};

const inferPriority = (title, index) => {
  if (/exam|deadline|urgent|asap|submit|finish|revise/i.test(title)) return "high";
  if (/dinner|water|clean|wash|buy/i.test(title)) return "low";
  return index === 0 ? "high" : "medium";
};

const inferDuration = (title) => {
  if (/exam|study|revise|assignment|project|write|read/i.test(title)) return 45;
  if (/dinner|cook|clean|wash/i.test(title)) return 30;
  if (/water|call|email|buy/i.test(title)) return 15;
  return 30;
};

const inferCategory = (title, user) => {
  if (/dinner|cook|clean|wash|water|plant|buy/i.test(title)) return "Personal";
  return roleConfig[user.role]?.categories?.[0] || "General";
};

const inferSlot = (title, user, priority) => {
  if (/dinner|tonight|night/i.test(title)) return "night";
  if (/evening|plant|water|cook/i.test(title)) return "evening";
  if (/exam|study|revise|assignment|project/i.test(title)) return getSuggestedSlot({ energyLevel: user.settings?.energyProfile, priority });
  return getSuggestedSlot({ energyLevel: user.settings?.energyProfile, priority });
};

const callAi = async ({ instruction, schema, fallback }) => {
  if (!client) return fallback();

  try {
    const response = await client.chat.completions.create({
      model: env.openAiModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert productivity planner. Reply with JSON only."
        },
        {
          role: "user",
          content: promptWithSchema(instruction, schema)
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content || "";
    const parsed = parseJson(raw);
    if (!parsed) return fallback();
    return parsed;
  } catch (_error) {
    return fallback();
  }
};

export const aiService = {
  async breakdownTask({ goal, user }) {
    const schema = {
      subtasks: [
        {
          title: "string",
          priority: "low|medium|high|urgent",
          estimatedDuration: 45,
          category: "string",
          suggestedSlot: "morning|afternoon|evening|night"
        }
      ],
      summary: "string"
    };

    return callAi({
      instruction: `User role: ${user.role}. Break down this goal into practical subtasks: ${goal}`,
      schema,
      fallback: () => ({
        subtasks: splitGoalIntoTasks(goal).map((title, index) => {
          const priority = inferPriority(title, index);
          return {
            title,
            priority,
            estimatedDuration: inferDuration(title),
            category: inferCategory(title, user),
            suggestedSlot: inferSlot(title, user, priority)
          };
        }),
        summary: "Fallback breakdown created from the goal text."
      })
    });
  },

  async planDay({ tasks, user, energyLevel }) {
    const schema = {
      plan: {
        morning: [{ taskId: "string", title: "string", duration: 45, reason: "string" }],
        afternoon: [{ taskId: "string", title: "string", duration: 45, reason: "string" }],
        evening: [{ taskId: "string", title: "string", duration: 45, reason: "string" }],
        night: [{ taskId: "string", title: "string", duration: 45, reason: "string" }]
      },
      overloadWarning: "string|null",
      guidance: "string"
    };

    return callAi({
      instruction: `User role: ${user.role}. Energy level: ${energyLevel}. Build a balanced daily plan for these tasks: ${JSON.stringify(
        tasks
      )}`,
      schema,
      fallback: () => buildDailyPlanFallback(tasks, { ...user.toObject?.(), settings: { energyProfile: energyLevel } })
    });
  },

  async rescheduleTasks({ tasks, user }) {
    const schema = {
      tasks: [
        {
          taskId: "string",
          title: "string",
          newSuggestedSlot: "morning|afternoon|evening|night",
          reason: "string"
        }
      ],
      summary: "string"
    };

    return callAi({
      instruction: `User role: ${user.role}. Reschedule these missed or overloaded tasks: ${JSON.stringify(tasks)}`,
      schema,
      fallback: () => ({
        tasks: tasks.map((task) => ({
          taskId: task._id || task.id,
          title: task.title,
          newSuggestedSlot: getSuggestedSlot({
            energyLevel: task.energyLevel || user.settings?.energyProfile,
            priority: task.priority
          }),
          reason: "Fallback rescheduler moved the task to a better energy match."
        })),
        summary: "Fallback rescheduler used urgency and energy patterns."
      })
    });
  },

  async productivityScore({ metrics }) {
    const schema = {
      score: 0,
      summary: "string",
      suggestions: ["string"]
    };

    return callAi({
      instruction: `Compute a productivity score from: ${JSON.stringify(metrics)}`,
      schema,
      fallback: () => calculateProductivityScore(metrics)
    });
  },

  async habitSuggestions({ tasks, user }) {
    const schema = {
      habits: [
        {
          title: "string",
          cadence: "string",
          reason: "string"
        }
      ]
    };

    return callAi({
      instruction: `Suggest habits for a ${user.role} user from these patterns: ${JSON.stringify(tasks)}`,
      schema,
      fallback: () => ({
        habits: [
          {
            title: user.role === "Student" ? "Daily revision block" : "Daily focus block",
            cadence: "daily",
            reason: "A repeatable small session will improve consistency."
          }
        ]
      })
    });
  },

  async futureRoadmap({ goal, months, user }) {
    const schema = {
      milestones: [{ title: "string", targetMonth: "string", description: "string" }],
      recurringTasks: ["string"],
      habits: ["string"],
      summary: "string"
    };

    return callAi({
      instruction: `Create a ${months}-month roadmap for a ${user.role} user pursuing: ${goal}`,
      schema,
      fallback: () => ({
        milestones: [
          { title: "Foundation", targetMonth: "Month 1", description: "Set scope, schedule, and first milestones." },
          { title: "Execution", targetMonth: `Month ${Math.max(2, Math.ceil(months / 2))}`, description: "Ship the core work consistently." },
          { title: "Finish Line", targetMonth: `Month ${months}`, description: "Review, refine, and complete the goal." }
        ],
        recurringTasks: ["Weekly planning review", "Daily priority reset"],
        habits: ["Protect one focus block", "Review progress every Sunday"],
        summary: "Fallback roadmap created using milestone pacing."
      })
    });
  },

  async voiceToTask({ transcript, user }) {
    const schema = {
      tasks: [
        {
          title: "string",
          priority: "low|medium|high|urgent",
          category: "string",
          suggestedSlot: "morning|afternoon|evening|night"
        }
      ]
    };

    return callAi({
      instruction: `Convert this voice note into structured tasks for a ${user.role} user: ${transcript}`,
      schema,
      fallback: () => ({
        tasks: splitGoalIntoTasks(transcript).map((title, index) => {
          const priority = inferPriority(title, index);
          return {
            title,
            priority,
            category: inferCategory(title, user),
            suggestedSlot: inferSlot(title, user, priority)
          };
        })
      })
    });
  }
};
