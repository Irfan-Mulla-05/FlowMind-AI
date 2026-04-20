import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { Note } from "../models/Note.js";
import { AIInsight } from "../models/AIInsight.js";
import { ActivityLog } from "../models/ActivityLog.js";

const seed = async () => {
  await connectDb();
  await Promise.all([User.deleteMany({}), Task.deleteMany({}), Note.deleteMany({}), AIInsight.deleteMany({}), ActivityLog.deleteMany({})]);

  const user = await User.create({
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "password123",
    role: "Developer",
    lifeMode: "Developer Mode",
    preferredTheme: "dark",
    preferredProductivityPeriod: "morning",
    xp: 840,
    streak: 6
  });

  const tasks = await Task.insertMany([
    {
      user: user._id,
      title: "Ship onboarding dashboard",
      description: "Finalize hero cards and guided setup.",
      priority: "high",
      category: "Coding",
      status: "in_progress",
      important: true,
      estimatedDuration: 120,
      preferredSlot: "morning",
      energyLevel: "high",
      orderIndex: 1,
      dueDate: new Date(Date.now() + 86400000)
    },
    {
      user: user._id,
      title: "Review API PR comments",
      priority: "medium",
      category: "Review",
      status: "todo",
      estimatedDuration: 45,
      preferredSlot: "afternoon",
      energyLevel: "normal",
      orderIndex: 2
    },
    {
      user: user._id,
      title: "Fix planner drag interactions",
      priority: "urgent",
      category: "Debugging",
      status: "completed",
      important: true,
      estimatedDuration: 90,
      preferredSlot: "morning",
      energyLevel: "high",
      orderIndex: 3,
      completedAt: new Date()
    }
  ]);

  await Note.insertMany([
    {
      user: user._id,
      title: "Sprint notes",
      content: "<p>Protect one deep work block every morning.</p>",
      pinned: true,
      tags: ["sprint", "focus"],
      linkedTasks: [tasks[0]._id]
    }
  ]);

  await AIInsight.create({
    user: user._id,
    type: "planner",
    title: "Developer Insight",
    summary: "Your highest leverage block is in the morning. Keep code review tasks for the afternoon.",
    payload: {}
  });

  await ActivityLog.insertMany([
    {
      user: user._id,
      type: "task_completed",
      message: 'Completed "Fix planner drag interactions"',
      metadata: { taskId: tasks[2]._id }
    },
    {
      user: user._id,
      type: "note_created",
      message: 'Created note "Sprint notes"',
      metadata: {}
    }
  ]);

  console.log("Seed complete");
  await mongoose.connection.close();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
