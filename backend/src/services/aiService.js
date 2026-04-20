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
        subtasks: goal
          .split(/,|and/)
          .map((item) => item.trim())
          .filter(Boolean)
          .map((title, index) => ({
            title,
            priority: index === 0 ? "high" : "medium",
            estimatedDuration: 45,
            category: roleConfig[user.role]?.categories?.[0] || "General",
            suggestedSlot: getSuggestedSlot({ energyLevel: user.settings?.energyProfile, priority: "medium" })
          })),
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
        tasks: transcript
          .split(/,|and/)
          .map((item) => item.trim())
          .filter(Boolean)
          .map((title) => ({
            title,
            priority: /urgent|asap|today/i.test(title) ? "high" : "medium",
            category: roleConfig[user.role]?.categories?.[0] || "General",
            suggestedSlot: /tonight|evening|night/i.test(title) ? "evening" : "morning"
          }))
      })
    });
  }
};
