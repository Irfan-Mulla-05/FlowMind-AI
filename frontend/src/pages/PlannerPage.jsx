import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SlotColumn from "../components/planner/SlotColumn";
import AiPlannerPanel from "../components/planner/AiPlannerPanel";
import Card from "../components/common/Card";
import { aiApi } from "../api/aiApi";
import { taskApi } from "../api/taskApi";

const emptyPlan = { morning: [], afternoon: [], evening: [], night: [] };

const PlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [plan, setPlan] = useState(emptyPlan);
  const [breakdown, setBreakdown] = useState([]);
  const [voiceTasks, setVoiceTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    taskApi
      .getAll({ status: "pending" })
      .then((data) => setTasks(data.tasks || []))
      .catch(() => setMessage("Could not load pending tasks. You can still plan from a breakdown or voice note."));
  }, []);

  const planSourceTasks = () => {
    const aiTasks = breakdown.length ? breakdown : voiceTasks;
    const source = tasks.length ? tasks : aiTasks;

    return source.map((task, index) => ({
      ...task,
      id: task._id || task.id || `ai-task-${index}`,
      estimatedDuration: task.estimatedDuration || 30,
      preferredSlot: task.preferredSlot || task.suggestedSlot
    }));
  };

  const runPlannerAction = async (action) => {
    setIsWorking(true);
    try {
      await action();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Planner action failed. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const updatePlan = (data) => {
    setPlan(data.plan || emptyPlan);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Planner"
        title="AI planning that respects real energy and real workload"
        description="Build a day plan, rebalance missed tasks, break down big goals, and keep scheduling adaptive to role and energy level."
      />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <AiPlannerPanel
          isWorking={isWorking}
          onPlan={() =>
            runPlannerAction(async () => {
              const sourceTasks = planSourceTasks();
              if (!sourceTasks.length) {
                setMessage("Add tasks, break down a goal, or convert a voice note before generating a day plan.");
                return;
              }

              const data = await aiApi.planDay({ tasks: sourceTasks, energyLevel: "normal" });
              updatePlan(data);
              setMessage(data.guidance || "Day plan generated.");
            })
          }
          onReschedule={() =>
            runPlannerAction(async () => {
              const sourceTasks = planSourceTasks();
              if (!sourceTasks.length) {
                setMessage("No pending, broken-down, or voice tasks are available to reschedule.");
                return;
              }

              const data = await aiApi.reschedule({ tasks: sourceTasks });
              setMessage(data.summary);
            })
          }
          onBreakdown={(goal) =>
            runPlannerAction(async () => {
              if (!goal.trim()) {
                setMessage("Enter a goal before asking for a breakdown.");
                return;
              }

              const data = await aiApi.breakdownTask({ goal });
              const subtasks = data.subtasks || [];
              setBreakdown(subtasks);
              setMessage(data.summary);

              if (subtasks.length) {
                const planData = await aiApi.planDay({ tasks: subtasks, energyLevel: "normal" });
                updatePlan(planData);
                setMessage(`${data.summary} A day plan was generated from the breakdown.`);
              }
            })
          }
          onVoice={(transcript) =>
            runPlannerAction(async () => {
              if (!transcript.trim()) {
                setMessage("Enter a voice note transcript before converting it.");
                return;
              }

              const data = await aiApi.voiceToTask({ transcript });
              const convertedTasks = data.tasks || [];
              setVoiceTasks(convertedTasks);
              setMessage("Voice input converted into structured tasks.");

              if (convertedTasks.length && !tasks.length && !breakdown.length) {
                const planData = await aiApi.planDay({ tasks: convertedTasks, energyLevel: "normal" });
                updatePlan(planData);
                setMessage("Voice input converted into structured tasks and planned for the day.");
              }
            })
          }
        />

        <div className="grid gap-5">
          <Card>
            <h3 className="text-lg font-semibold text-white">Planner guidance</h3>
            <p className="mt-2 text-sm text-slate-400">{message || "Generate a plan to see AI scheduling guidance here."}</p>
          </Card>
          <div className="grid gap-5 lg:grid-cols-2">
            <SlotColumn title="Morning" items={plan.morning} />
            <SlotColumn title="Afternoon" items={plan.afternoon} />
            <SlotColumn title="Evening" items={plan.evening} />
            <SlotColumn title="Night" items={plan.night} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-white">Breakdown output</h3>
          <div className="mt-4 space-y-3">
            {breakdown.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-medium text-white">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">
                  {[item.category, item.priority, `${item.estimatedDuration} min`, item.suggestedSlot].filter(Boolean).join(" - ")}
                </div>
              </div>
            ))}
            {!breakdown.length && <p className="text-sm text-slate-500">No breakdown yet.</p>}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Voice to task output</h3>
          <div className="mt-4 space-y-3">
            {voiceTasks.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-medium text-white">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">{[item.category, item.priority, item.suggestedSlot].filter(Boolean).join(" - ")}</div>
              </div>
            ))}
            {!voiceTasks.length && <p className="text-sm text-slate-500">No voice tasks yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlannerPage;
