import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SlotColumn from "../components/planner/SlotColumn";
import AiPlannerPanel from "../components/planner/AiPlannerPanel";
import Card from "../components/common/Card";
import { aiApi } from "../api/aiApi";
import { taskApi } from "../api/taskApi";

const PlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [plan, setPlan] = useState({ morning: [], afternoon: [], evening: [], night: [] });
  const [breakdown, setBreakdown] = useState([]);
  const [voiceTasks, setVoiceTasks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    taskApi.getAll({ status: "pending" }).then((data) => setTasks(data.tasks));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Planner"
        title="AI planning that respects real energy and real workload"
        description="Build a day plan, rebalance missed tasks, break down big goals, and keep scheduling adaptive to role and energy level."
      />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <AiPlannerPanel
          onPlan={async () => {
            const data = await aiApi.planDay({ tasks, energyLevel: "normal" });
            setPlan(data.plan);
            setMessage(data.guidance);
          }}
          onReschedule={async () => {
            const data = await aiApi.reschedule({ tasks });
            setMessage(data.summary);
          }}
          onBreakdown={async (goal) => {
            const data = await aiApi.breakdownTask({ goal });
            setBreakdown(data.subtasks);
            setMessage(data.summary);
          }}
          onVoice={async (transcript) => {
            const data = await aiApi.voiceToTask({ transcript });
            setVoiceTasks(data.tasks);
            setMessage("Voice input converted into structured tasks.");
          }}
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
                  {item.category} • {item.priority} • {item.estimatedDuration} min • {item.suggestedSlot}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Voice to task output</h3>
          <div className="mt-4 space-y-3">
            {voiceTasks.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-medium text-white">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">
                  {item.category} • {item.priority} • {item.suggestedSlot}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlannerPage;
